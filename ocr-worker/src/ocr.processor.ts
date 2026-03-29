import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as tesseract from 'tesseract.js';
import { RedisService } from './redis.service';
@Processor(process.env.OCR_QUEUE_NAME)
export class OcrProcessor extends WorkerHost {
  constructor(private redisService: RedisService) {
    super()
  }

  async process(job: Job<any>): Promise<any> {
    const { filePath, userId } = job.data;
    const redis = this.redisService.getClient();

    try {
      switch (job.name) {
        case 'extract-text': {
          console.log(`Processing OCR for file: ${filePath}`);
          const {
            data: { text },
          } = await tesseract.recognize(filePath, 'eng');

          console.log(`OCR result for job ${job.id}:`, text);
          await redis.set(`ocr_result:${job.id}`, JSON.stringify(this.parseAadhaarOCR(text)), 'EX', 3600);
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

  parseAadhaarOCR(rawText) {
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

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

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
      name = lines.find(l =>
        /^[A-Z\s]{5,}$/.test(l) &&
        !l.includes("GOVERNMENT") &&
        !l.includes("INDIA")
      );
    }

    // 6. PIN Code (fix common OCR issue: extra digit)
    let pinMatch = text.match(/\b\d{6,7}\b/);
    let pin = null;
    if (pinMatch) {
      pin = pinMatch[0].substring(0, 6); // trim to 6 digits
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
