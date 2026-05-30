# Deployment

Production uses the existing Dockerfiles and `docker-compose.prod.yaml`.

## Start Production

From the repository root:

```sh
docker compose -f docker-compose.prod.yaml up --build -d
docker compose -f docker-compose.prod.yaml logs -f backend
```

Stop production services:

```sh
docker compose -f docker-compose.prod.yaml down
```

## Production Services

The production compose file runs:

- `postgres_db`
- `redis`
- `backend`
- `frontend`

The backend exposes port `5001`. The frontend exposes host port `3000` mapped to container port `80`.

## Required Environment

Provide production values for database, Redis, backend, frontend, JWT, encryption, CORS, and asset URL settings. Do not commit the production `.env` file.

## Migrations

Production should run committed migrations only. Do not run `migration:generate` in production.

Before running migrations from the production backend container, confirm the production image includes the migration config and runtime command. The current backend Dockerfile is optimized for `npm run start:prod`, so production migration execution may need a dedicated release step or image adjustment.

## Checklist

- Production `.env` exists on the server and is not committed.
- `JWT_SECRET` and `ENCRYPTION_KEY` are strong production secrets.
- `CORS_ORIGINS`, `VITE_API_URL`, and `VITE_ASSET_URL` match the deployed domain.
- Database backups exist before migrations.
- Images are rebuilt after dependency or Dockerfile changes.
- Logs are checked after startup.
