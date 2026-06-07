# AI Module

Owns Posta Mitra, document indexing, and document RAG.

## Local Map

- [`ai-chat`](ai-chat/README.md): classifies, validates, and routes user messages.
- [`structured-retrieval`](structured-retrieval/README.md): handles database-backed AI actions.
- [`rag`](rag/README.md): answers from authorized document chunks.
- [`document-index`](document-index/README.md): prepares uploaded documents for RAG.
- [`ollama`](ollama/README.md): generic local model adapter.
- `prompts`, `dto`, and `enums`: shared AI contracts.

## Boundaries

- Database access and record authorization belong to `records/RecordQueryService`.
- `OllamaService` must not know about records, RAG, prompts, or response construction.
- Treat Ollama intent output and uploaded document content as untrusted.
- Send only authorized, redacted document chunks to Ollama.
- Records may import `DocumentIndexService`; other AI internals stay inside this module.

Supported intent values are defined in `AiChatIntent`. Runtime settings use
`AI_CHAT_ENABLED`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, and
`OLLAMA_EMBEDDING_MODEL`.
