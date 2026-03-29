import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from './redis.service';

@Injectable()
export class OcrService {
  constructor(
    @InjectQueue(process.env.OCR_QUEUE_NAME) private ocrQueue: Queue,
    private redisService: RedisService
  ) { }

  async uploadAndQueue(file: Express.Multer.File) {
    const job = await this.ocrQueue.add('extract-text', {
      filePath: `/app/uploads/${file.filename}`,
    });

    return { jobId: job.id };
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

      await redis.del(`ocr_result:${jobId}`);
      return { ... result };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  }
}
