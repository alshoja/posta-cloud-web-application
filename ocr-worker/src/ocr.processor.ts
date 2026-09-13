import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as tesseract from 'tesseract.js';
import { promises as fs } from 'node:fs';
import { StorageService } from './storage.service';
import { OCR_IMAGE_TEXT_EXTRACTION_JOB } from './queue.constants';

type OcrJobData = {
  storageReference?: string;
  deleteAfterProcessing?: boolean;
  userId?: string;
};

@Processor(process.env.OCR_QUEUE_NAME, { concurrency: 1 })
export class OcrProcessor extends WorkerHost {
  constructor(private readonly storageService: StorageService) {
    super();
  }

  async process(job: Job<OcrJobData>): Promise<any> {
    const { storageReference, deleteAfterProcessing } = job.data || {};
    let filePath: string | undefined;

    try {
      if (!storageReference) {
        throw new Error('Missing storage reference in OCR job payload');
      }

      filePath = await this.storageService.downloadToTempFile(storageReference);

      switch (job.name) {
        case OCR_IMAGE_TEXT_EXTRACTION_JOB: {
          console.log(`Processing RAG OCR for file: ${filePath}`);
          const {
            data: { text },
          } = await tesseract.recognize(filePath, 'eng');
          return { text: this.normalizeOcrText(text) };
        }
        default: {
          throw new Error(`Unsupported OCR job name: ${job.name}`);
        }
      }
    } catch (err) {
      console.error(`Error processing job ${job.id}:`, err);
      return null;
    } finally {
      if (filePath) {
        await fs.unlink(filePath).catch(() => undefined);
      }
      if (deleteAfterProcessing && storageReference) {
        await this.storageService.delete(storageReference).catch((error) => {
          console.error(`Failed to delete transient OCR object for job ${job.id}:`, error);
        });
      }
    }
  }

  private normalizeOcrText(rawText: string): string {
    return rawText
      .replace(/\r/g, '\n')
      .replace(/[|]/g, 'I')
      .replace(/SIO/g, 'S/O')
      .replace(/DIO/g, 'D/O')
      .replace(/WIO/g, 'W/O')
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
  }
}
