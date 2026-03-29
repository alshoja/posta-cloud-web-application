import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as tesseract from 'tesseract.js';

@Processor(process.env.OCR_QUEUE_NAME)
export class OcrProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {  
    const { filePath, userId } = job.data;

    try {
      switch (job.name) {
        case 'extract-text': {
          console.log(`Processing OCR for file: ${filePath} (user: ${userId})`);
          const {
            data: { text },
          } = await tesseract.recognize(filePath, 'eng');

          console.log(`OCR result for job ${job.id}:`, text);
          return text;
        }
        case 'someOtherJob': {
          console.info(`Unknown job name: ${job.name}`);
          break;
        }
      }
    } catch (err) {
      console.error(`Error processing job ${job.id}:`, err);
      throw err;
    }
  }
}
