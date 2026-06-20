# Search Module

Owns optional search infrastructure adapters.

## Boundaries

- Elasticsearch is disabled by default through `DOCUMENT_SEARCH_BM25_ENABLED`.
- Phase 1 only configures the client and health probe helpers.
- Document indexing and RAG result ranking stay in later phases.
