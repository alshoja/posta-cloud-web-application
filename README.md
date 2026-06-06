# Posta Cloud

Posta Cloud is a full-stack, Docker-managed record collection platform built with Vue 3, Vuetify, NestJS, PostgreSQL, Redis, OCR processing, and a local Ollama-powered AI assistant.

I built this as a practical sample project for field-data workflows: users can store structured records for people in a local area, manage address and personal details, upload documents, use OCR support to reduce manual typing, and ask a local AI assistant to find records using natural language.

## Highlights

- Full-stack TypeScript-style architecture with a Vue frontend and NestJS backend.
- Docker Compose orchestration for frontend, backend, database, Redis, OCR worker, and pgAdmin.
- PostgreSQL persistence with TypeORM entities and migration workflow.
- Redis-backed background processing for OCR tasks.
- Document upload support with a dedicated worker reading from shared uploads.
- Posta Mitra, a floating AI chat assistant for natural-language record search.
- Local Ollama integration where the LLM extracts safe filters and the backend performs authorized database queries.
- Environment-driven configuration for local and production deployments.
- Security-focused documentation for secrets, personal data, and production setup.

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | Vue 3, Vite, Vuetify, Pinia |
| Backend | NestJS, TypeORM, class-validator |
| Database | PostgreSQL |
| Queue / Worker | Redis, OCR worker service |
| AI | Ollama, local chat model |
| Infrastructure | Docker, Docker Compose, pgAdmin |

## What The App Includes

- **Record workflow**: multi-step record creation for personal, identity, occupation, family, policy, and document details.
- **Document support**: upload files in the records flow and serve uploaded assets from the backend.
- **OCR auto-fill**: send supported identity documents to the OCR worker and use extracted details to reduce manual entry.
- **Posta Mitra AI assistant**: ask questions such as “Show completed records”, “Find people living abroad”, or “Who has policies?”.
- **Role-aware access**: regular users see their own records; admins follow the backend’s broader record visibility rules.
- **Docker-first operation**: frontend, backend, PostgreSQL, Redis, OCR worker, Ollama, and pgAdmin run through Compose.

## Architecture

```text
frontend -> backend API -> PostgreSQL
                   |
                   v
                 Redis -> OCR worker -> uploaded documents

frontend chat -> backend AI endpoint -> Ollama
                         |
                         v
                    PostgreSQL records
```

Services:

- `frontend`: Vue app on `http://localhost:3000`
- `backend`: NestJS API on `http://localhost:5001`
- `ocr-worker`: background OCR processor
- `postgres_db`: PostgreSQL database
- `redis`: queue backend
- `ollama`: local AI model server on `http://localhost:11434`
- `pgadmin`: database admin UI on `http://localhost:8080`

## Screenshots

![Posta Cloud records screen](https://github.com/user-attachments/assets/6df7fc33-0d4c-4753-a637-4a1124997674)

![Posta Cloud form screen](https://github.com/user-attachments/assets/46d8a67a-ff77-4cfc-b7a9-2c0ac4fe2a8a)

<img width="2281" height="1148" alt="image" src="https://github.com/user-attachments/assets/761cf6ea-ca41-4d19-9180-f08439d0937f" />

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

For the AI assistant, pull the local model once after Compose starts:

```sh
docker compose exec ollama ollama pull llama3.2:3b
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`
- Ollama: `http://localhost:11434`
- pgAdmin: `http://localhost:8080`

## AI Assistant

Posta Mitra is the app’s first AI feature. It is a floating chat widget in the authenticated frontend layout.

Current behavior:

- The user asks a record-search question in plain language.
- The backend sends the message to local Ollama.
- Ollama returns a safe JSON intent and filters.
- The backend validates those filters, applies auth rules, queries PostgreSQL, and returns compact record cards.

The LLM does not query the database directly and does not generate SQL. See [AI Chat Module](backend/src/modules/ai-chat/README.md) for implementation details and future extension ideas.

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
