# OpenAI

Generic adapter for the OpenAI API. Used in place of `ollama` when
`AI_PROVIDER=openai`.

- `chat()` accepts prompts and returns model text.
- `embed()` returns an embedding for supplied text, truncated to
  `EMBEDDING_DIMENSIONS` so it stays compatible with the existing
  `document_chunks.embedding` pgvector column.
- Keep prompts, domain decisions, record data shaping, and RAG logic outside
  this folder.
- Feature availability and model endpoints come from backend configuration
  (`OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_EMBEDDING_MODEL`).
