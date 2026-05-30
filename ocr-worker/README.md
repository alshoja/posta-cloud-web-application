# OCR Worker

The OCR worker is a containerized NestJS-style service that consumes Redis OCR jobs and reads uploaded files from the backend uploads volume.

## Docker Workflow

From the repository root:

```sh
docker compose up -d ocr-worker
docker compose logs -f ocr-worker
docker compose exec ocr-worker sh
```

The development compose file mounts:

- `./ocr-worker:/app`
- `./backend/uploads:/app/uploads`

This lets the worker process files uploaded by the backend while keeping code changes visible in the repository.

## Key Paths

- Entrypoint: `src/main.ts`
- Worker module: `src/worker.module.ts`
- OCR processor: `src/ocr.processor.ts`
- Redis integration: `src/redis.module.ts`, `src/redis.service.ts`
- Tesseract data: `eng.traineddata`

## Common Tasks

```sh
docker compose exec ocr-worker npx nest g module <name>
docker compose exec ocr-worker npx nest g service <name>
```

Agent rules for Nest CLI and specs live in [../AGENTS.md](../AGENTS.md).
