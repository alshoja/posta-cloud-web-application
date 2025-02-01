import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService as ESService } from '@nestjs/elasticsearch';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticsearchConnectionException } from '../filter/elastic.exception';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name);
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

  async indexRecord(
    record: {
      id: number;
      email: string;
      mobile: string;
      firstName: string;
    },
    index: string,
  ) {
    return this.esClient.index({
      index,
      id: record.id.toString(),
      body: {
        firstName: record.firstName,
        email: record.email,
        mobile: record.mobile,
      },
    });
  }

  async searchRecords(query: string, index: string) {
    console.log('🚀 ~ ElasticsearchService ~ searchRecords ~ query:', query);
    // const results = await this.esClient.
    const result = await this.esClient.search({
      index,
      body: {
        query: {
          // match_all: {},
          multi_match: {
            query,
            fields: ['firstName', 'email', 'mobile'],
          },
        },
      },
    });
    console.log(
      '🚀 ~ ElasticsearchService ~ searchRecords ~ result:',
      result.hits.hits.map((hit) => hit._source),
    );

    return result.hits.hits.map((hit) => hit._source);
  }

  async deleteDocumentById(id: string, index: string) {
    try {
      const result = await this.esClient.delete({
        index,
        id,
      });
      console.log(
        '🚀 ~ ElasticsearchService ~ deleteDocumentById ~ result:',
        result,
      );
      if (result.result === 'deleted') {
        console.log('Document deleted successfully');
      } else {
        console.log('Document not found');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }
}
