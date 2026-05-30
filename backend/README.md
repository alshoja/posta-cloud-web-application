# Backend

The backend is a NestJS API service for auth, users, records, document uploads, encryption, Redis queue integration, and OCR job coordination.

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
- Shared services and infrastructure: `src/shared`
- Entities: `src/**/*.entity.ts`
- Migrations: `database/migrations`
- TypeORM config: `database/typeorm.config.ts`

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
