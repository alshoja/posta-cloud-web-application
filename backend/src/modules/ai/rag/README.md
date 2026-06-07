# RAG

Answers questions using indexed document chunks.

- `RecordRagService` supports one-record questions and cross-record semantic search.
- Embed the question, format it with the shared vector utility, and retrieve by cosine distance.
- Apply `RecordQueryService.guardQueryAccess()` inside every retrieval query.
- Send only retrieved redacted chunks to Ollama.
- Return record results plus document name, record ID, and page citations.
