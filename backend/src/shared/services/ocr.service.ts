import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OCR_IMAGE_TEXT_EXTRACTION_JOB, OCR_QUEUE } from '../constants/queue.constants';
import { BullQueueEventsService } from './bull-queue-events.service';

@Injectable()
export class OcrService {
  constructor(
    @InjectQueue(OCR_QUEUE) private ocrQueue: Queue,
    private readonly bullQueueEventsService: BullQueueEventsService,
  ) {}

  async extractImageText(
    storageReference: string,
    deleteAfterProcessing = false,
  ): Promise<string> {
    const job = await this.ocrQueue.add(OCR_IMAGE_TEXT_EXTRACTION_JOB, {
      storageReference,
      deleteAfterProcessing,
    });

    const result = await this.bullQueueEventsService.waitForJob<{ text?: string }>(
      OCR_QUEUE,
      job,
      120_000,
    );

    return result.text ?? '';
  }
}
