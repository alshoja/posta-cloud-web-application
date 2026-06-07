import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class DocumentVectorIndexService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (!this.configService.get<boolean>('config.isDevelopment')) {
      return;
    }

    await this.dataSource.query(`
      CREATE INDEX IF NOT EXISTS "IDX_document_chunks_embedding"
      ON "document_chunks"
      USING hnsw ("embedding" vector_cosine_ops)
    `);
  }
}
