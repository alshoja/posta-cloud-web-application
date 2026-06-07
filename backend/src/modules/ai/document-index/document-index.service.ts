import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DOCUMENT_INDEX_QUEUE_NAME } from '../../../shared/constants/document-index.constants';

@Injectable()
export class DocumentIndexService {
  constructor(
    @InjectQueue(DOCUMENT_INDEX_QUEUE_NAME)
    private readonly documentIndexQueue: Queue,
  ) {}

  async queueDocuments(documentIds: number[]): Promise<void> {
    await Promise.all(
      documentIds.map((documentId) =>
        this.documentIndexQueue.add(
          'index-document',
          { documentId },
          {
            attempts: 2,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: 200,
            removeOnFail: 500,
          },
        ),
      ),
    );
  }
}
