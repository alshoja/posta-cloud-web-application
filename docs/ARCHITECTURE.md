# Architecture

Posta Cloud is a Docker Compose application made of a Vue frontend, NestJS backend, OCR worker, PostgreSQL with pgvector, Redis, Ollama, and pgAdmin.

## Service Layout

- `frontend`: browser app served on port `3000` in development and port `80` inside the production container.
- `backend`: NestJS API served on port `5001`.
- `ocr-worker`: background worker that consumes OCR jobs from Redis.
- `postgres_db`: PostgreSQL with pgvector and persistent Docker volume storage.
- `redis`: queue backend used for OCR, document embedding, and temporary AI search context.
- `ollama`: local chat and embedding model server.
- `pgadmin`: database administration UI for local development.

All services share the `common-net` Docker network.

## Data Flow

The frontend calls the backend API using `VITE_API_URL`. The backend owns authentication, authorization, validation, database queries, document processing orchestration, and AI routing. Ollama never receives database access and never generates executable SQL.

```text
Frontend
  -> NestJS backend
      -> PostgreSQL/pgvector
      -> Redis queues
          -> OCR worker
      -> Ollama chat and embedding APIs
```

Uploaded files live in the shared uploads directory. The backend queues document embedding after a document is saved. Images are sent to the OCR worker. PDFs are first checked for embedded text; scanned PDFs are rendered page by page in the backend and their temporary images are sent sequentially to the existing OCR worker.

## Backend Structure

The backend uses NestJS modules under `backend/src/modules`. Shared Redis, OCR, validation, upload, seeding, and utility code live under `backend/src/shared` and `backend/src/utilities`.

Entities are TypeORM entities under `backend/src/**/*.entity.ts`. Migrations are stored under `backend/database/migrations/`.

### AI Module

The parent `backend/src/modules/ai` area separates AI behavior by responsibility:

- `ai-chat`: public endpoint, intent classification, normalization, and routing.
- `structured-retrieval`: record search, pagination context, and safe record summaries.
- `rag`: semantic retrieval and document-grounded answers.
- `document-embedding`: extraction, redaction, chunking, embeddings, and vector persistence.
- `ollama`: generic `chat()` and `embed()` integration only.
- `prompts`, `dto`, and `enums`: shared AI contracts.

`RecordQueryService` remains in the records module and owns authorized record queries. Both structured retrieval and RAG use it so permission rules are enforced by backend TypeORM queries.

### Document Indexing

```text
Document saved
  -> Redis document-embedding queue
  -> DocumentIngestionProcessor
  -> extract text
      -> PDF with embedded text: unpdf
      -> scanned PDF: unpdf render at scale 2 -> OCR worker, maximum 10 pages
      -> uploaded image: OCR worker
  -> redact and chunk page text
  -> Ollama embeddinggemma
  -> validate 768-dimension vector
  -> document_chunks table
  -> HNSW cosine index
```

Only redacted chunks are persisted for RAG. Temporary scanned-PDF page images are deleted immediately after OCR. Documents track extraction states including `PENDING`, `PROCESSING`, `READY`, `UNSUPPORTED`, and `FAILED`.

### AI Request Flow

```text
POST /api/ai-chat/message
  -> AiChatService asks Ollama for a JSON intent
  -> backend validates the intent and filters
  -> StructuredRetrievalService for record search, pagination, or summaries
     OR RecordRagService for document questions and semantic document search
  -> RecordQueryService guards accessible records
  -> backend returns compact records and optional document/page citations
```

For RAG, the backend embeds the question, applies record access rules inside the vector query, and sends only retrieved redacted chunks to Ollama. The model cannot bypass these query restrictions.

## Frontend Structure

The frontend uses Vue 3 with Vuetify, Pinia, and Vue Router. Views, stores, router modules, shared components, and styling each have dedicated folders under `frontend/src`.

## Security Model

The app handles personal records and uploaded documents. Secrets come from `.env` through Docker Compose. Sensitive values, real user data, uploads, and database dumps must not be committed.

Security is enforced by backend code:

- DTOs validate client input.
- `RecordQueryService.guardQueryAccess()` scopes record and RAG queries.
- Ollama output is treated as untrusted and normalized before use.
- Ollama never receives credentials, direct database access, or executable query control.
- Only redacted document chunks are stored and supplied as RAG evidence.
