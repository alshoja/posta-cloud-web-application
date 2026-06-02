# AI Chat Module

This module powers Posta Mitra, the first Posta AI Assistant backend feature: natural-language record search.

## What It Does

- Exposes `POST /api/ai-chat/message`.
- Accepts a user chat message such as `Show completed records from idukki`.
- Sends the message to local Ollama to extract a safe JSON search intent.
- Validates the Ollama output and ignores unsupported fields.
- Queries records with TypeORM using normal PostgreSQL filters.
- Returns a short assistant answer plus compact record cards for the Posta Mitra frontend chat widget.

## Current Flow

```text
Frontend chat
  -> POST /api/ai-chat/message
  -> AiChatController
  -> AiChatService
  -> OllamaService extracts filters
  -> AiChatService queries records
  -> frontend receives answer + records
```

Ollama is used only to understand the user's message. It must never query the database directly and must never generate SQL.

## Supported Intent

Only this intent is supported in v1:

```json
{
  "intent": "record_search",
  "filters": {}
}
```

Unsupported messages return a friendly response explaining that the assistant can currently help find records only.

## Supported Filters

Ollama may return only these filters:

- `status`
- `search`
- `name`
- `email`
- `mobileNumber`
- `village`
- `panchayat`
- `district`
- `postOffice`
- `isRedirected`
- `isAbroad`
- `hasDocuments`
- `hasPolicies`

All filters are normalized in `OllamaService` before being used.

## Security Rules

- Do not trust raw Ollama output.
- Do not allow Ollama-generated SQL.
- Keep all database access in backend TypeORM queries.
- Keep existing auth behavior:
  - normal users see only their own records
  - admins follow the existing records-list visibility rule
- Return compact record fields only, not full sensitive record details.
- Limit chat search results to 10 records.

## Configuration

Runtime config comes from `backend/src/config/app.config.ts`:

- `OLLAMA_BASE_URL`, default `http://ollama:11434`
- `OLLAMA_MODEL`, default `llama3.2:3b`
- `AI_CHAT_ENABLED`, default `true`

The Docker Compose `ollama` service stores models in the `ollama-data` volume. Pull the model once after starting Docker:

```sh
docker compose exec ollama ollama pull llama3.2:3b
```

## Future Extension Ideas

- Add a `record_summary` intent for questions like `Summarize record 12`.
- Add a `record_missing_details` intent for questions like `What is missing in record 12?`.
- Add document RAG later by persisting OCR text and retrieving document chunks.
- Keep new intents routed through the same `/api/ai-chat/message` endpoint.
