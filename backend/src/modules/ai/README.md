# AI Module

This module owns Posta Mitra, the AI assistant for record search, record
summaries, and document RAG answers.

## Current Flow

```text
Frontend chat
  -> POST /api/ai-chat/message
  -> AiChatController
  -> AiChatService.answerUserMessage()
  -> OllamaService.chat() classifies the normalized intent
  -> RecordQueryService or RecordRagService
  -> OllamaService.chat() only when an answer must be generated
  -> frontend receives answer + records + optional citations
```

## Boundaries

- `ai-chat` owns the public chat endpoint, user-message routing, record search
  pagination, safe record-summary data, and chat response DTOs.
- `ollama` owns only generic Ollama calls: `chat()` and `embed()`.
- `rag` owns document-question and document-search answering.
- `document-index` owns extraction, redaction, chunking, queueing, embeddings,
  and persistence for uploaded documents.
- `records/RecordQueryService` owns authorized record queries and record access
  rules.

No service outside `modules/ai` should import from `ai-chat`. Shared AI
infrastructure should be imported through the parent `ai` area or the focused
child module.

## Supported Intents

- `record_search`
- `record_next_page`
- `record_previous_page`
- `record_summary`
- `document_question`
- `document_search`
- `unsupported`

Unsupported messages return a friendly response explaining the supported Posta
Mitra actions.

## Prompts

Static prompts live in `modules/ai/prompts`.

Services choose the prompt and pass it to `OllamaService.chat()`. The Ollama
service must stay unaware of records, summaries, retrieved document chunks, and chat
response construction.

## Temporary Search Memory

The module stores only the last record-search context in Redis so users can ask
follow-up questions such as `show me the next 10` or `previous page`.

Redis key pattern:

```text
ai_chat:user:<userId>:last_record_search
```

Stored context includes only safe search state:

- `filters`
- `limit`
- `offset`
- `total`

Do not store full chat transcripts, raw LLM responses, sensitive record fields,
or full record objects in Redis.

## Security Rules

- Do not trust raw Ollama output.
- Do not allow Ollama-generated SQL.
- Keep all database access in backend TypeORM queries.
- Keep existing auth behavior:
  - normal users see only their own records
  - admins follow the existing records-list visibility rule
- Return compact record fields only, not full sensitive record details.
- Default chat search results to 10 records and cap requested limits at 50
  records.
- Send only redacted document chunks to Ollama for RAG answers.

## Configuration

Runtime config comes from `backend/src/config/app.config.ts`:

- `OLLAMA_BASE_URL`, default `http://ollama:11434`
- `OLLAMA_MODEL`, default `llama3.2:3b`
- `OLLAMA_EMBEDDING_MODEL`, default `embeddinggemma`
- `AI_CHAT_ENABLED`, default `true`

The Docker Compose `ollama` service stores models in the `ollama-data` volume.
Pull the model once after starting Docker:

```sh
docker compose exec ollama ollama pull llama3.2:3b
docker compose exec ollama ollama pull embeddinggemma
```
