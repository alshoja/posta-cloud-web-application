import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name);
  private readonly enabled: boolean;
  private readonly indexName: string;
  private readonly node: string;
  private readonly client?: Client;

  constructor(private readonly configService: ConfigService) {
    this.enabled =
      this.configService.get<boolean>('config.documentSearchBm25Enabled') ??
      false;
    this.indexName =
      this.configService.get<string>('config.elasticsearchIndex') ||
      'document_chunks';
    this.node =
      this.configService.get<string>('config.elasticsearchNode') ||
      'http://elasticsearch:9200';

    if (this.enabled) {
      this.client = new Client({
        node: this.node,
      });
    }
  }

  async onModuleInit(): Promise<void> {
    if (!this.enabled) {
      this.logger.log('BM25 search is disabled; Elasticsearch client is not active.');
      return;
    }

    const isAvailable = await this.ping();
    if (isAvailable) {
      this.logger.log(
        `Elasticsearch is reachable at ${this.node}; using index "${this.indexName}".`,
      );
      return;
    }

    this.logger.warn(
      `Elasticsearch is enabled but not reachable at ${this.node}.`,
    );
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getIndexName(): string {
    return this.indexName;
  }

  async ping(): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      return await this.client.ping();
    } catch {
      return false;
    }
  }
}
