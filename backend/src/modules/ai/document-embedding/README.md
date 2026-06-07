# Document Embedding

Converts uploaded record documents into redacted, embedded chunks for RAG.

- `DocumentIngestionQueueService` queues document IDs after record step six commits.
- `DocumentParserService` parses text PDFs and sends images or rendered scanned pages to OCR.
- Scanned PDFs are processed sequentially at scale `2` and limited to 10 pages.
- Temporary rendered pages must always be deleted.
- `DocumentChunkingService` owns redaction, chunking, and content hashes.
- `DocumentIngestionProcessor` owns status changes and embedding persistence.
- Validate embeddings with `shared/utilities/vector.utility.ts`.
