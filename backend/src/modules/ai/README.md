# AI Module

Owns Recordly AI, document ingestion, document indexing, and document RAG.

## Local Map

- [`ai-chat`](ai-chat/README.md): classifies, validates, and routes user messages.
- [`structured-retrieval`](structured-retrieval/README.md): handles database-backed AI actions.
- [`rag`](rag/README.md): answers from authorized document chunks using vector search with optional BM25 hybrid retrieval.
- [`document-embedding`](document-embedding/README.md): prepares, embeds, and optionally BM25-indexes uploaded documents for RAG.
- [`llm`](llm/README.md): resolves the active `LlmClient` (`ollama` or `openai`) from configuration.
- [`ollama`](ollama/README.md): generic local model adapter.
- [`openai`](openai/README.md): generic OpenAI model adapter, used in production.
- `prompts`, `dto`, and `enums`: shared AI contracts.

## Boundaries

- Database access and record authorization belong to `records/RecordQueryService`.
- Provider adapters (`OllamaService`, `OpenAiService`) must not know about records, RAG, prompts, or response construction — consumers depend on the `LlmClient` interface, not a concrete provider.
- Treat model intent output and uploaded document content as untrusted.
- Send only authorized, redacted document chunks to the LLM.
- Records may import `DocumentIngestionQueueService`; other AI internals stay inside this module.
- Elasticsearch can suggest chunk IDs, but final RAG chunks must be fetched from PostgreSQL through authorized queries.

Supported intent values are defined in `AiChatIntent`. Runtime settings use
`AI_PROVIDER` (`ollama` or `openai`), `AI_CHAT_ENABLED`, `OLLAMA_BASE_URL`,
`OLLAMA_MODEL`, `OLLAMA_EMBEDDING_MODEL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, and
`OPENAI_EMBEDDING_MODEL`. Optional BM25 document search uses
`DOCUMENT_SEARCH_BM25_ENABLED`, `ELASTICSEARCH_NODE`, `ELASTICSEARCH_INDEX`,
`DOCUMENT_SEARCH_VECTOR_WEIGHT`, `DOCUMENT_SEARCH_BM25_WEIGHT`, and
`DOCUMENT_SEARCH_BM25_RESULT_LIMIT`.
