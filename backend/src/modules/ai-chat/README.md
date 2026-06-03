# AI Chat Module

This module powers Posta Mitra, the first Posta AI Assistant backend feature: natural-language record search.

## What It Does

- Exposes `POST /api/ai-chat/message`.
- Accepts a user chat message such as `Show completed records from idukki`.
- Sends the message to local Ollama to extract a safe JSON search intent.
- Validates the Ollama output and ignores unsupported fields.
- Queries records with TypeORM using normal PostgreSQL filters.
- Uses a separate Ollama summary prompt for `record_summary`.
- Returns a short assistant answer plus compact record cards for the Posta Mitra frontend chat widget.
- Includes `role: "assistant"` in chat responses so the frontend can render assistant output differently from user text.

## Current Flow

```text
Frontend chat
  -> POST /api/ai-chat/message
  -> AiChatController
  -> AiChatService
  -> OllamaService extracts filters
  -> AiChatService queries records
  -> OllamaService writes summary when intent is record_summary
  -> frontend receives answer + records
```

Ollama is used to understand the user's message and to write friendly record summaries from safe backend-provided context. It must never query the database directly and must never generate SQL.

## Supported Intent

These intents are supported:

```json
{
  "intent": "record_search",
  "filters": {}
}
```

```json
{ "intent": "record_next_page", "filters": { "limit": 10 } }
```

```json
{ "intent": "record_previous_page" }
```

```json
{ "intent": "record_summary", "recordId": 151 }
```

Unsupported messages return a friendly response explaining the currently supported Posta Mitra actions.

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
- `limit`

All filters are normalized in `OllamaService` before being used.

## Temporary Search Memory

The module stores only the last record-search context in Redis so users can ask follow-up questions such as `show me the next 10` or `previous page`.

Redis key pattern:

```text
ai_chat:user:<userId>:last_record_search
```

Stored context includes only safe search state:

- `filters`
- `limit`
- `offset`
- `total`

Do not store full chat transcripts, raw LLM responses, sensitive record fields, or full record objects in Redis.

## Record Summary Prompt

`record_summary` is handled in two steps:

1. `AiChatService` fetches the accessible record and builds a safe summary context.
2. `OllamaService.writeUserFriendlyRecordSummary()` asks Ollama to write a short user-friendly summary from that context.

The summary context intentionally excludes sensitive identity fields such as Aadhaar, passport, driving license, election ID, and encrypted values.

Assistant answers may use simple Markdown such as bold text and bullet points. The frontend renders assistant Markdown with raw HTML disabled.

## Security Rules

- Do not trust raw Ollama output.
- Do not allow Ollama-generated SQL.
- Keep all database access in backend TypeORM queries.
- Keep existing auth behavior:
  - normal users see only their own records
  - admins follow the existing records-list visibility rule
- Return compact record fields only, not full sensitive record details.
- Default chat search results to 10 records and cap requested limits at 50 records.

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
