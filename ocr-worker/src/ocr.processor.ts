import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as tesseract from 'tesseract.js';
import { promises as fs } from 'node:fs';
import { RedisService } from './redis.service';

type OcrJobData = {
  filePath?: string;
  userId?: string;
};

@Processor(process.env.OCR_QUEUE_NAME, { concurrency: 1 })
export class OcrProcessor extends WorkerHost {
  constructor(private redisService: RedisService) {
    super();
  }

  async process(job: Job<OcrJobData>): Promise<any> {
    const { filePath } = job.data || {};
    const redis = this.redisService.getClient();

    try {
      if (!filePath) {
        throw new Error('Missing file path in OCR job payload');
      }

      await fs.access(filePath);

      switch (job.name) {
        case 'extract-text': {
          console.log(`Processing OCR for file: ${filePath}`);
          const {
            data: { text },
          } = await tesseract.recognize(filePath, 'eng');

          const parsed = this.parseAadhaarOCR(text);
          await redis.set(
            `ocr_result:${job.id}`,
            JSON.stringify({
              success: true,
              data: parsed,
            }),
            'EX',
            3600,
          );

          return parsed;
        }
        case 'someOtherJob': {
          console.info(`Unknown job name: ${job.name}`);
          break;
        }
        default: {
          throw new Error(`Unsupported OCR job name: ${job.name}`);
        }
      }
    } catch (err) {
      console.error(`Error processing job ${job.id}:`, err);
      await redis.set(
        `ocr_result:${job.id}`,
        JSON.stringify({
          success: false,
          error:
            err instanceof Error ? err.message : 'Unexpected OCR worker error',
        }),
        'EX',
        3600,
      );
      return null;
    }
  }

  parseAadhaarOCR(rawText: string) {
    // 1. Normalize & clean
    let text = rawText
      .replace(/\r/g, "\n")
      .replace(/[|]/g, "I")
      .replace(/SIO/g, "S/O")
      .replace(/DIO/g, "D/O")
      .replace(/WIO/g, "W/O")
      .replace(/[^\x20-\x7E\n]/g, " ")
      .replace(/\n+/g, "\n")
      .trim();

    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    // 2. Aadhaar Number
    const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
    const aadhaar = aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, "") : null;

    // 3. DOB
    const dobMatch = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
    const dob = dobMatch ? dobMatch[0] : null;

    // 4. Gender
    const genderMatch = text.match(/\b(Male|Female)\b/i);
    const gender = genderMatch ? genderMatch[0] : null;

    // 5. Name (smart detection)
    let name = null;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];

      if (
        /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(l) && // Proper case
        !l.includes("Government") &&
        !l.includes("India") &&
        !l.includes("Authority")
      ) {
        name = l;
        break;
      }
    }

    // fallback (uppercase names)
    if (!name) {
      name = lines.find(
        (line) =>
          /^[A-Z\s]{5,}$/.test(line) &&
          !line.includes('GOVERNMENT') &&
          !line.includes('INDIA'),
      );
    }

    // 6. PIN Code (fix common OCR issue: extra digit)
    let pinMatch = text.match(/\b\d{6,7}\b/);
    let pin = null;
    if (pinMatch) {
      pin = pinMatch[0].substring(0, 6);
    }

    // 7. Address extraction (multi-line)
    let addressStartIndex = lines.findIndex(l =>
      l.includes("HOUSE") ||
      l.includes("PO") ||
      l.includes("DISTRICT") ||
      l.includes("State")
    );

    let address = null;
    if (addressStartIndex !== -1) {
      address = lines
        .slice(addressStartIndex, addressStartIndex + 6)
        .join(", ");
    }

    // 8. Cleanup address
    if (address) {
      address = address
        .replace(/,+/g, ",")
        .replace(/\s+,/g, ",")
        .trim();
    }

    return {
      name: name || null,
      dob,
      gender,
      aadhaar,
      address,
      pin
    };
  }
}
