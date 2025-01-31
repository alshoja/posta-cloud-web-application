import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService as ESService } from '@nestjs/elasticsearch';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticsearchConnectionException } from '../filter/elastic.exception';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name);
  private readonly recordIndex = 'records;';
  constructor(
    private readonly esClient: ESService,
    private readonly elasticsearchService: NestElasticsearchService,
  ) {}

  async onModuleInit() {
    try {
      const health = await this.elasticsearchService.ping();

      if (health) {
        this.logger.verbose('Elasticsearch is connected and healthy');
      }
    } catch (error) {
      this.logger.error('Elasticsearch connection failed', error.stack);
      throw new ElasticsearchConnectionException(
        'Elasticsearch is not connected. Please check the connection.',
      );
    }
  }

  async indexRecord(record: { id: number; email: string; mobile: string }) {
    return this.esClient.index({
      index: this.recordIndex,
      id: record.id.toString(),
      body: {
        name: record.email,
        description: record.mobile,
      },
    });
  }

  async searchRecords(query: string) {
    const result = await this.esClient.search({
      index: this.recordIndex,
      body: {
        query: {
          multi_match: {
            query,
            fields: ['email', 'mobile'],
          },
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }
}
