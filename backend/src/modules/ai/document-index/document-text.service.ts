import { Injectable } from '@nestjs/common';
import { basename, extname, join, resolve } from 'node:path';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { OCR_QUEUE_NAME } from '../../../shared/constants/queue.constants';
import { BullQueueEventsService } from '../../../shared/services/bull-queue-events.service';
import { ExtractedDocumentPage } from './interfaces/extracted-document-page.interface';

const MAX_SCANNED_PDF_PAGES = 10;
const MIN_MEANINGFUL_TEXT_LENGTH = 30;

@Injectable()
export class DocumentTextService {
  private readonly uploadsRoot = resolve('/app/uploads');

  constructor(
    @InjectQueue(OCR_QUEUE_NAME) private readonly ocrQueue: Queue,
    private readonly bullQueueEventsService: BullQueueEventsService,
  ) {}

  async extract(fileUrl: string): Promise<ExtractedDocumentPage[]> {
    const filePath = this.getSafeUploadedFilePath(fileUrl);
    const extension = extname(filePath).toLowerCase();

    if (extension === '.pdf') {
      return this.extractPdf(filePath);
    }

    if (['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tif', '.tiff'].includes(extension)) {
      return [{ pageNumber: 1, text: await this.extractImageText(filePath) }];
    }

    throw new Error('Unsupported document type');
  }

  private async extractPdf(filePath: string): Promise<ExtractedDocumentPage[]> {
    const { definePDFJSModule, extractText, getDocumentProxy, renderPageAsImage } =
      await import('unpdf');
    await definePDFJSModule(() => import('pdfjs-dist/legacy/build/pdf.mjs'));

    const pdfBuffer = new Uint8Array(await readFile(filePath));
    const pdf = await getDocumentProxy(pdfBuffer);
    const result = await extractText(pdf);
    const pages = result.text.map((text, index) => ({
      pageNumber: index + 1,
      text: this.normalizeText(text),
    }));

    if (this.hasMeaningfulText(pages)) {
      await pdf.destroy();
      return pages;
    }

    if (result.totalPages > MAX_SCANNED_PDF_PAGES) {
      await pdf.destroy();
      throw new Error(
        `Scanned PDFs are limited to ${MAX_SCANNED_PDF_PAGES} pages`,
      );
    }

    const pageCount = result.totalPages;
    const ocrPages: ExtractedDocumentPage[] = [];

    try {
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        const image = await renderPageAsImage(pdf, pageNumber, {
          canvasImport: () => import('@napi-rs/canvas'),
          scale: 2,
        });
        const tempPath = join(
          this.uploadsRoot,
          `.rag-${randomUUID()}-${pageNumber}.png`,
        );

        try {
          await writeFile(tempPath, new Uint8Array(image));
          ocrPages.push({
            pageNumber,
            text: this.normalizeText(await this.extractImageText(tempPath)),
          });
        } finally {
          await unlink(tempPath).catch(() => undefined);
        }
      }
    } finally {
      await pdf.destroy();
    }

    return ocrPages;
  }

  private async extractImageText(filePath: string): Promise<string> {
    const job = await this.ocrQueue.add('extract-rag-text', { filePath });
    const result = await this.bullQueueEventsService.waitForJob<{ text?: string }>(
      OCR_QUEUE_NAME,
      job,
      120_000,
    );

    return result.text ?? '';
  }

  private getSafeUploadedFilePath(fileUrl: string): string {
    let pathname = fileUrl;
    try {
      pathname = new URL(fileUrl).pathname;
    } catch {
      pathname = fileUrl;
    }

    const filename = basename(decodeURIComponent(pathname));
    const filePath = resolve(this.uploadsRoot, filename);
    if (!filePath.startsWith(`${this.uploadsRoot}/`)) {
      throw new Error('Invalid uploaded document path');
    }

    return filePath;
  }

  private hasMeaningfulText(pages: ExtractedDocumentPage[]): boolean {
    return pages
      .map((page) => page.text)
      .join('')
      .replace(/[^A-Za-z0-9]/g, '').length >= MIN_MEANINGFUL_TEXT_LENGTH;
  }

  private normalizeText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
}
