import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OcrService {
  constructor(
    @InjectQueue(process.env.OCR_QUEUE_NAME) private ocrQueue: Queue
  ) {}

  async uploadAndQueue(file: Express.Multer.File) {
    const job = await this.ocrQueue.add('extract-text', {
      filePath: `/app/uploads/${file.filename}`,
    });

    return { jobId: job.id };
  }
}