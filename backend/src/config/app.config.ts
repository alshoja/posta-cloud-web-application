import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT ?? '5001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isDevelopment: (process.env.NODE_ENV ?? 'development') === 'development',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:5001',
  redisHost: process.env.REDIS_HOST ?? 'redis',
  redisPort: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  seedUserName: process.env.SEED_USER_NAME ?? 'seed_admin',
  seedUserPassword: process.env.SEED_USER_PASSWORD ?? 'SeedPass123!',
  encryptionKey: process.env.ENCRYPTION_KEY ?? '',
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
}));
