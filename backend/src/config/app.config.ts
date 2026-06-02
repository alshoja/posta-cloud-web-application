import { registerAs } from '@nestjs/config';

const readBooleanEnv = (value: string | undefined, fallback: boolean) => {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT ?? '5001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isDevelopment: (process.env.NODE_ENV ?? 'development') === 'development',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:5001',
  redisHost: process.env.REDIS_HOST ?? 'redis',
  redisPort: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  encryptionKey: process.env.ENCRYPTION_KEY ?? '',
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://ollama:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2:3b',
  aiChatEnabled: readBooleanEnv(process.env.AI_CHAT_ENABLED, true),
}));
