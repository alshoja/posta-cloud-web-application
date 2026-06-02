# Backend

The backend is a NestJS API service for auth, users, records, document uploads, encryption, Redis queue integration, OCR job coordination, and the Posta Mitra AI chat endpoint.

## Docker Workflow

From the repository root:

```sh
docker compose up -d backend
docker compose logs -f backend
docker compose exec backend sh
```

The development compose file mounts `./backend` into `/app`, so generated files and migrations created inside the container are visible in the repository.

## Key Paths

- Modules: `src/modules`
- AI chat module: `src/modules/ai-chat`
- Shared services and infrastructure: `src/shared`
- Entities: `src/**/*.entity.ts`
- Migrations: `database/migrations`
- TypeORM config: `database/typeorm.config.ts`

## AI Chat

`src/modules/ai-chat` exposes `POST /api/ai-chat/message` for Posta Mitra, the frontend AI assistant.

The current AI flow is intentionally small:

- Ollama converts a user message into a safe record-search intent and filters.
- The backend validates those filters and queries records with TypeORM.
- Auth rules stay in the backend; the LLM never queries the database directly or generates SQL.

See `src/modules/ai-chat/README.md` before extending AI behavior.

## Common Tasks

```sh
docker compose exec backend npx nest g module <name>
docker compose exec backend npx nest g controller <name>
docker compose exec backend npx nest g service <name>
docker compose exec backend npm run migration:generate --name=<migration-name>
docker compose exec backend npm run migration:run
docker compose exec backend npm run seed
```

Agent rules for Nest CLI, migrations, and specs live in [../AGENTS.md](../AGENTS.md).
