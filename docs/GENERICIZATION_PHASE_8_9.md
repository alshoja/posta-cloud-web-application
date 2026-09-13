# Genericization — Phase 8 & 9

Phases 1–7 (the 7-step record wizard: Personal, Identity, Occupation & Address,
Family, Financial Accounts, Documents, Review) are done — all India-specific
fields, labels, and hardcoded option lists have been replaced with generic,
free-text equivalents, and the Review step UI has had a full visual pass.

- **Phase 8 — OCR identity auto-fill**: done — removed entirely (see below for why).
- **Phase 9 — AI / RAG behavior**: mechanical renames are already done (verified
  clean — see below); what's left is a genuine behavioral/UX redesign, not cleanup.

---

## Phase 8 — OCR identity auto-fill: removed, not genericized

The original plan here was to genericize the OCR worker's identity-document
parser (fuzzy generic `extractIdNumber`/`extractPostalCode` heuristics instead
of Aadhaar/Voter ID/Driving License-specific regexes). That plan changed during
implementation: **there is no reliable way to predict what document a global
user will upload**, so building fuzzy heuristics would still guess wrong often
for little benefit. Users already enter identity documents manually in Step 2
(a free-text-typed list since Phase 2) — auto-fill was always a convenience
layer on top of that, never the only way to enter the data.

Traced the full call chain and confirmed OCR was used for two fully independent
things that never shared code:
- **Identity auto-fill** (`OCR_IDENTITY_EXTRACTION_JOB`): Step 1's "Document
  Auto-fill" card → `POST /extract/text` → `ocrService.uploadAndQueue()` → the
  `parseAadhaar`/`parseVoterId`/`parseDrivingLicense` engine in the worker.
  **This entire path was deleted.**
- **RAG document text extraction** (`OCR_IMAGE_TEXT_EXTRACTION_JOB`): Step 6
  document uploads → `document-parser.service.ts` → `ocrService.extractImageText()`
  → just `tesseract.recognize()` + `normalizeOcrText()`. Already fully generic
  (no document-type guessing at all). **Untouched.**

### What was removed

- `ocr-worker/src/ocr.processor.ts` — the entire identity-parsing engine
  (`IdentityDocumentType`, `parseIdentityDocument`, all four `parse*` document
  methods, `detectDocumentType`/`normalizeDocumentType`, and every
  `extract*`/`normalizeGender`/`scoreFields` helper that only served them).
  Kept: the `OCR_IMAGE_TEXT_EXTRACTION_JOB` case and `normalizeOcrText()`.
- `backend/src/app.controller.ts` — the three `extract/text*` endpoints
  (upload+queue, service status, job-result polling), all exclusive to the
  auto-fill UI.
- `backend/src/shared/services/ocr.service.ts` — `uploadAndQueue()`,
  `getServiceStatus()`, `getJobResult()`. Kept `extractImageText()` untouched.
- `backend/src/shared/services/storage.service.ts` — `createAutofillKey()`
  (only caller was `uploadAndQueue()`).
- `OCR_IDENTITY_EXTRACTION_JOB` removed from both `queue.constants.ts` copies
  (backend and ocr-worker) — `OCR_IMAGE_TEXT_EXTRACTION_JOB` kept in both.
- `frontend/src/views/record/RecordForm.vue` — the whole "Document Auto-fill"
  card in Step 1 and every identifier that only served it (`ocrDocumentType`,
  `ocrScanFile`, `checkOcrServiceStatus`, `applyOcrResultToForm`,
  `runOcrAutofill`, `fillIdentityDocumentNumber`, etc.). Manually adding
  identity documents in Step 2 is unaffected.

Verified via repo-wide grep afterward that nothing referencing the removed
identity-extraction path was missed, and both `npx tsc --noEmit`
(backend + ocr-worker) and `npm run build` (frontend) pass clean.

---

## Phase 9 — AI / RAG behavior

### Current state (verified by grep, not assumed)

Mechanical renames from Phase 1 are **fully complete** — a repo-wide search for
`aadhaar|panchayat|village|houseName|houseNumber|streetName|electionID|drivingLicense`
across `backend/src/modules/ai/` and `backend/src/modules/search/` returns
nothing. `ai-chat.prompts.ts`'s "Allowed filter keys" list already reads:

```
status, search, name, email, mobileNumber, city, state, country, postalCode,
isRedirected, isAbroad, hasDocuments, hasFinancialAccounts, limit
```

So there is **no cleanup work left** here — this phase is purely deciding new
behavior, which is why it was deferred until the app could actually be used.

### What to decide (by using the AI chat feature first, then deciding)

- **Identity documents aren't searchable via chat at all** right now (not in
  the allowed filter keys, not in retrieval). Decide whether queries like
  "find records with a passport on file" should be supported, and if so
  whether that's a structured filter (`identityDocumentType`) or something
  handled via the hybrid document search instead.
- **Elasticsearch index mapping** (`elasticsearch.service.ts`) — check whether
  `postalCode`'s current analyzer/mapping assumes numeric-only values; it's
  typed as a string already, but worth confirming the ES field mapping and
  any query-side parsing doesn't silently break on alphanumeric postal codes.
- **Prompt wording review** — the prompt file was only mechanically renamed,
  never re-read holistically. Check `ai-chat.prompts.ts` for any remaining
  implicit India-specific assumptions in phrasing or examples (e.g. phone
  number formats, example cities) even though no banned literal strings
  remain.
- **Free-text type fields in retrieval** — `FinancialAccount.type` and
  `IdentityDocument.type` are now open comboboxes (any string a user types),
  not fixed enums. Decide whether structured retrieval / filters need
  fuzzy or case-insensitive matching on these now that they're no longer a
  closed list.

Files most likely to be touched, once the above is decided:
- `backend/src/modules/ai/prompts/ai-chat.prompts.ts`
- `backend/src/modules/ai/ai-chat/ai-chat.service.ts`
- `backend/src/modules/ai/structured-retrieval/structured-retrieval.service.ts`
- `backend/src/modules/ai/rag/record-rag.service.ts`
- `backend/src/modules/ai/rag/document-hybrid-search.service.ts`
- `backend/src/modules/search/services/elasticsearch.service.ts`
- `frontend/src/components/ai/AiChatWidget.vue`, `frontend/src/stores/aiChat.ts`

---

## Notes

- Per `AGENTS.md`: no TypeORM migrations needed for any of this — dev uses
  `synchronize: true` and there's no production data to preserve.
- Also still tracked, not part of either phase above, deferred to the very end
  of the whole project: `node_modules` not syncing into Docker containers on
  host `npm install` (needs a native-binary carve-out for `bcrypt`/`@napi-rs/canvas`).
