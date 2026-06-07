import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from './redis.service';
import {
  OCR_IDENTITY_EXTRACTION_JOB,
  OCR_IMAGE_TEXT_EXTRACTION_JOB,
  OCR_QUEUE,
} from '../constants/queue.constants';
import { BullQueueEventsService } from './bull-queue-events.service';

const OCR_WORKER_HEARTBEAT_KEY = 'ocr_worker:heartbeat';

@Injectable()
export class OcrService {
  constructor(
    @InjectQueue(OCR_QUEUE) private ocrQueue: Queue,
    private redisService: RedisService,
    private readonly bullQueueEventsService: BullQueueEventsService,
  ) {}

  async uploadAndQueue(file: Express.Multer.File, documentType?: string) {
    const job = await this.ocrQueue.add(OCR_IDENTITY_EXTRACTION_JOB, {
      filePath: `/app/uploads/${file.filename}`,
      documentType,
    });

    return { jobId: job.id };
  }

  async extractImageText(filePath: string): Promise<string> {
    const job = await this.ocrQueue.add(OCR_IMAGE_TEXT_EXTRACTION_JOB, {
      filePath,
    });
    
    const result = await this.bullQueueEventsService.waitForJob<{ text?: string }>(
      OCR_QUEUE,
      job,
      120_000,
    );

    return result.text ?? '';
  }

  async getServiceStatus() {
    try {
      const redis = this.redisService.getClient();
      const lastHeartbeat = await redis.get(OCR_WORKER_HEARTBEAT_KEY);
      const workers = await this.ocrQueue.getWorkers();
      const hasActiveWorker = workers.length > 0;

      return {
        enabled: Boolean(lastHeartbeat) || hasActiveWorker,
        lastHeartbeat,
        workers: workers.length,
      };
    } catch (err: any) {
      return {
        enabled: false,
        error: err.message || 'Unable to check OCR service status',
      };
    }
  }

  async getJobResult(jobId: string) {
    const job = await this.ocrQueue.getJob(jobId);
    const redis = this.redisService.getClient();

    if (!job) {
      return { error: "Job not found" };
    }

    try {
      const redisData = await redis.get(`ocr_result:${jobId}`);

      if (!redisData) {
        return { pending: true };
      }

      let result = null;
      try {
        result = JSON.parse(redisData);
      } catch (parseError) {
        return { error: "Invalid JSON in Redis" };
      }

      if (result?.success === false) {
        await redis.del(`ocr_result:${jobId}`);
        return { error: result.error || 'OCR processing failed' };
      }

      if (result?.success === true) {
        await redis.del(`ocr_result:${jobId}`);
        return result.data ?? {};
      }

      await redis.del(`ocr_result:${jobId}`);
      return { ... result };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  }
}
