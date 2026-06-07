import { Injectable } from '@nestjs/common';
import { basename, extname, join, resolve } from 'node:path';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { OcrService } from '../../../../shared/services/ocr.service';
import { ExtractedDocumentPage } from '../interfaces/extracted-document-page.interface';

const MAX_SCANNED_PDF_PAGES = 10;
const MIN_MEANINGFUL_TEXT_LENGTH = 30;

type UnpdfModule = typeof import('unpdf');
type PdfDocument = Awaited<ReturnType<UnpdfModule['getDocumentProxy']>>;

@Injectable()
export class DocumentParserService {
  private readonly uploadsRoot = resolve('/app/uploads');
  private unpdfModulePromise?: Promise<UnpdfModule>;

  constructor(private readonly ocrService: OcrService) { }

  async extract(fileUrl: string): Promise<ExtractedDocumentPage[]> {
    const filePath = this.getSafeUploadedFilePath(fileUrl);
    const extension = extname(filePath).toLowerCase();

    if (extension === '.pdf') {
      return this.parsePdf(filePath);
    }
    // if its a direct image file, we can directly send it to OCR without going through the PDF parsing logic
    if (['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tif', '.tiff'].includes(extension)) {
      return [
        {
          pageNumber: 1,
          text: await this.ocrService.extractImageText(filePath),
        },
      ];
    }

    throw new Error('Unsupported document type');
  }

  private async parsePdf(filePath: string): Promise<ExtractedDocumentPage[]> {
    const unpdf = await this.loadUnpdfModule();
    const pdfBuffer = new Uint8Array(await readFile(filePath));
    const pdf = await unpdf.getDocumentProxy(pdfBuffer);

    try {
      const pages = await this.parsePdfEmbeddedText(pdf, unpdf);
      if (this.hasMeaningfulText(pages)) {
        return pages;
      }

      this.ensureScannedPdfPageLimit(pdf.numPages);
      return this.parseScannedPdfToText(pdf, unpdf);
    } finally {
      await pdf.destroy();
    }
  }

  private async parsePdfEmbeddedText(
    pdf: PdfDocument,
    unpdf: UnpdfModule,
  ): Promise<ExtractedDocumentPage[]> {
    const result = await unpdf.extractText(pdf);

    return result.text.map((text, index) => ({
      pageNumber: index + 1,
      text: this.normalizeText(text),
    }));
  }

  private async parseScannedPdfToText(
    pdf: PdfDocument,
    unpdf: UnpdfModule,
  ): Promise<ExtractedDocumentPage[]> {
    const ocrPages: ExtractedDocumentPage[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const image = await unpdf.renderPageAsImage(pdf, pageNumber, {
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
          text: this.normalizeText(
            await this.ocrService.extractImageText(tempPath),
          ),
        });
      } finally {
        await unlink(tempPath).catch(() => undefined);
      }
    }

    return ocrPages;
  }

  private ensureScannedPdfPageLimit(pageCount: number): void {
    if (pageCount > MAX_SCANNED_PDF_PAGES) {
      throw new Error(
        `Scanned PDFs are limited to ${MAX_SCANNED_PDF_PAGES} pages`,
      );
    }
  }

  private loadUnpdfModule(): Promise<UnpdfModule> {
    this.unpdfModulePromise ??= import('unpdf').then(async (unpdf) => {
      await unpdf.definePDFJSModule(
        () => import('pdfjs-dist/legacy/build/pdf.mjs'),
      );

      return unpdf;
    });

    return this.unpdfModulePromise;
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
