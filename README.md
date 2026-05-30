# Posta Cloud

Posta Cloud is a full-stack, Docker-managed record collection platform built with Vue 3, Vuetify, NestJS, PostgreSQL, Redis, and an OCR worker.

I built this as a practical sample project for field-data workflows: users can store structured records for people in a local area, manage address and personal details, upload documents, and use OCR support to reduce manual typing.

## Highlights

- Full-stack TypeScript-style architecture with a Vue frontend and NestJS backend.
- Docker Compose orchestration for frontend, backend, database, Redis, OCR worker, and pgAdmin.
- PostgreSQL persistence with TypeORM entities and migration workflow.
- Redis-backed background processing for OCR tasks.
- Document upload support with a dedicated worker reading from shared uploads.
- Environment-driven configuration for local and production deployments.
- Security-focused documentation for secrets, personal data, and production setup.

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | Vue 3, Vite, Vuetify, Pinia |
| Backend | NestJS, TypeORM, class-validator |
| Database | PostgreSQL |
| Queue / Worker | Redis, OCR worker service |
| Infrastructure | Docker, Docker Compose, pgAdmin |

## Architecture

```text
frontend -> backend API -> PostgreSQL
                   |
                   v
                 Redis -> OCR worker -> uploaded documents
```

Services:

- `frontend`: Vue app on `http://localhost:3000`
- `backend`: NestJS API on `http://localhost:5001`
- `ocr-worker`: background OCR processor
- `postgres_db`: PostgreSQL database
- `redis`: queue backend
- `pgadmin`: database admin UI on `http://localhost:8080`

## Screenshots

![Posta Cloud records screen](https://github.com/user-attachments/assets/6df7fc33-0d4c-4753-a637-4a1124997674)

![Posta Cloud form screen](https://github.com/user-attachments/assets/46d8a67a-ff77-4cfc-b7a9-2c0ac4fe2a8a)

![Posta Cloud detail screen](https://github.com/user-attachments/assets/deff9a56-4c98-4587-aa53-6a934794eb20)

## Quick Start

Copy `.env.example` to `.env` if needed, then start the full project:

```sh
./setup.sh
```

Useful Docker commands:

```sh
docker compose up -d
docker compose up --build -d
docker compose logs -f backend
docker compose down
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`
- pgAdmin: `http://localhost:8080`

## Database

Migration files live in `backend/database/migrations/`.

```sh
docker compose exec backend npm run migration:generate --name=<migration-name>
docker compose exec backend npm run migration:run
docker compose exec backend npm run seed
```

See [Database](docs/DATABASE.md) for the full workflow.

## Production

Production uses the existing Dockerfiles and `docker-compose.prod.yaml`:

```sh
docker compose -f docker-compose.prod.yaml up --build -d
docker compose -f docker-compose.prod.yaml logs -f backend
docker compose -f docker-compose.prod.yaml down
```

Production secrets belong in environment configuration and should never be committed.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Development](docs/DEVELOPMENT.md)
- [Database](docs/DATABASE.md)
- [Security](docs/SECURITY.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Agent Instructions](AGENTS.md)
