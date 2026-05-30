# Frontend

The frontend is a Vue 3 app built with Vite, Vuetify, Pinia, and Vue Router.

## Docker Workflow

From the repository root:

```sh
docker compose up -d frontend
docker compose logs -f frontend
docker compose exec frontend sh
```

The development compose file mounts `./frontend` into `/app`. Changes made in the repository are picked up by the containerized dev server.

## Key Paths

- Views live in `src/views`.
- Shared UI components live in `src/components/shared`.
- Pinia stores live in `src/stores`.
- Router modules live in `src/router`.
- Vuetify setup lives in `src/plugins/vuetify.ts`.
- Global styles live in `src/scss`.

Environment values are passed through Docker Compose using `VITE_API_URL` and `VITE_ASSET_URL`. Agent workflow rules live in [../AGENTS.md](../AGENTS.md).
