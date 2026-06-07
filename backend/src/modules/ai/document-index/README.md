# Document Index

Converts uploaded record documents into redacted, embedded chunks for RAG.

- `DocumentIndexService` queues document IDs after record step six commits.
- `DocumentTextService` parses text PDFs and sends images or rendered scanned pages to OCR.
- Scanned PDFs are processed sequentially at scale `2` and limited to 10 pages.
- Temporary rendered pages must always be deleted.
- `DocumentContentService` owns redaction, chunking, and content hashes.
- `DocumentIndexProcessor` owns status changes and chunk persistence.
- Validate embeddings with `shared/utilities/vector.utility.ts`.
