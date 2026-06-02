import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

const OCR_WORKER_HEARTBEAT_KEY = 'ocr_worker:heartbeat';
const HEARTBEAT_INTERVAL_MS = 5000;
const HEARTBEAT_TTL_SECONDS = 15;

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private heartbeatTimer?: ReturnType<typeof setInterval>;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: Number(process.env.REDIS_PORT) || 6379,
    });

    this.client.on('connect', () => {
      console.log('✅ Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    this.startHeartbeat();
  }

  async onModuleDestroy() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    await this.client?.del(OCR_WORKER_HEARTBEAT_KEY);
  }

  getClient(): Redis {
    return this.client;
  }

  private startHeartbeat(): void {
    void this.publishHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      void this.publishHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);
  }

  private async publishHeartbeat(): Promise<void> {
    try {
      await this.client.set(
        OCR_WORKER_HEARTBEAT_KEY,
        new Date().toISOString(),
        'EX',
        HEARTBEAT_TTL_SECONDS,
      );
    } catch (error) {
      console.error('Failed to publish OCR worker heartbeat:', error);
    }
  }
}
