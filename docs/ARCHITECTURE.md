# Architecture

Posta Cloud is a Docker Compose application made of a Vue frontend, NestJS backend, OCR worker, PostgreSQL database, Redis queue, and pgAdmin.

## Service Layout

- `frontend`: browser app served on port `3000` in development and port `80` inside the production container.
- `backend`: NestJS API served on port `5001`.
- `ocr-worker`: background worker that consumes OCR jobs from Redis.
- `postgres_db`: PostgreSQL container with persistent Docker volume storage.
- `redis`: queue backend used by the backend and OCR worker.
- `pgadmin`: database administration UI for local development.

All services share the `common-net` Docker network.

## Data Flow

The frontend calls the backend API using `VITE_API_URL`. The backend stores records in PostgreSQL, writes uploaded files under `backend/uploads`, and queues OCR work through Redis. The OCR worker reads jobs from Redis, accesses uploads through the mounted uploads directory, and sends OCR results back through the app's queue/data flow.

## Backend Structure

The backend uses NestJS modules under `backend/src/modules`. Shared Redis, OCR, validation, upload, seeding, and utility code live under `backend/src/shared` and `backend/src/utilities`.

Entities are TypeORM entities under `backend/src/**/*.entity.ts`. Migrations are stored under `backend/database/migrations/`.

## Frontend Structure

The frontend uses Vue 3 with Vuetify, Pinia, and Vue Router. Views, stores, router modules, shared components, and styling each have dedicated folders under `frontend/src`.

## Security Model

The app handles personal records and uploaded documents. Secrets come from `.env` through Docker Compose. Sensitive values, real user data, uploads, and database dumps must not be committed.
