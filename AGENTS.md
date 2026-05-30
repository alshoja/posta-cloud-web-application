# Agent Instructions

This file is the source of truth for Codex, Claude, and other coding agents. Read this first. Do not preload every markdown file; open README or docs/ files only when the task needs that context.

## Project

This repository is a Docker-first multi-service app:

- `frontend`: Vue 3, Vite, Vuetify, Pinia
- `backend`: NestJS API
- `ocr-worker`: NestJS-style OCR queue worker
- `postgres_db`: PostgreSQL
- `redis`: OCR queue backend
- `pgadmin`: database admin UI

Docker Compose is the normal control plane. Check `docker-compose.yaml` versus `docker-compose.prod.yaml` because development and production services can differ. Service-level npm scripts may exist, but they should be treated as commands run inside containers.

## Commands

Use these from the repository root:

```sh
./setup.sh
docker compose up -d
docker compose up --build -d
docker compose down
docker compose logs -f <service>
docker compose exec <service> sh
```

Production uses `docker-compose.prod.yaml` and the existing Dockerfiles:

```sh
docker compose -f docker-compose.prod.yaml up --build -d
docker compose -f docker-compose.prod.yaml down
docker compose -f docker-compose.prod.yaml logs -f <service>
```

Do not promote local `npm run dev` or local `npm run build` as the primary workflow. Use service-level npm scripts only through containers when needed.

Production compose should use service production Dockerfiles, avoid source bind mounts, use named volumes for runtime data, and never run dev commands such as `npm run start:dev`.

## NestJS Generation

Use Nest CLI for backend and OCR worker NestJS structure whenever possible:

```sh
docker compose exec backend npx nest g module <name>
docker compose exec backend npx nest g controller <name>
docker compose exec backend npx nest g service <name>
docker compose exec backend npx nest g resource <name>
docker compose exec ocr-worker npx nest g service <name>
```

Use `resource` only when a full resource is needed. After generation, adapt the files to existing local patterns.

Do not create or maintain new `.spec.ts` files for now unless the user explicitly asks.

## Backend Design

Follow SOLID principles in backend code.

- Use feature-based modules: one module per feature.
- Keep controllers thin and focused on routing, guards, request parsing, and response handoff.
- Put business logic in services.
- Use DTOs with `class-validator` and `class-transformer` for request validation.
- Define interfaces/types for meaningful data structures; avoid loose `any`.
- Inject services through constructors only.
- Prefer module-level singleton providers.
- Avoid injecting framework internals such as `ModuleRef` unless there is a clear need.
- Avoid circular dependencies between modules and services; extract shared behavior into a clear shared provider.
- Use `forwardRef()` only when there is no cleaner design.
- Keep one responsibility per controller.
- Use proper HTTP decorators such as `@Get`, `@Post`, `@Patch`, and `@Delete`.
- Return consistent response structures for similar endpoints.
- Use built-in `HttpException` types or custom exceptions for expected errors.
- Use the existing global exception filter pattern for consistent error responses.
- Never expose internal stack traces in production responses.
- Validate all inputs and never trust client data.
- Configure CORS intentionally and restrict origins through environment configuration.
- Avoid sensitive data in logs.
- Read secrets from environment variables; never hardcode them.

## Database And Migrations

Creating or editing an entity/model does not automatically create a migration.

Migration files live in the repository under:

```text
backend/database/migrations/
```

Use this flow:

```sh
docker compose exec backend npm run migration:generate --name=<migration-name>
docker compose exec backend npm run migration:run
docker compose exec backend npm run migration:revert
docker compose exec backend npm run seed
```

Generate migrations in development only. Inspect the generated migration file before running it locally. Production should run committed migrations only. Commit reviewed migrations with the related entity changes.

## Testing Policy

Testing is not a required acceptance step right now. Do not add or update `.spec.ts` files unless explicitly requested. Use focused build, lint, or container checks only when relevant and safe.

## Safety Rules

- Never commit `.env`, production secrets, database dumps, real personal data, or generated credentials.
- Keep `.env.example` limited to placeholders.
- Treat seed and migration changes as high-risk; document expected database effects.
- Preserve user changes in the working tree.
- Keep code changes feature-specific and small.
- Update only the relevant area for the requested task.
- Do not change unrelated code, formatting, files, or behavior.
- Prefer existing Vue, Vuetify, Pinia, NestJS, TypeORM, and Docker Compose patterns.
