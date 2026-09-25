# Frontend–Backend Contract

## Purpose

AWS Textract Studio is currently a frontend-only demonstration. The frontend is structured around realistic asynchronous contracts, but it does not call AWS, store credentials, upload to S3, or authenticate users.

The current dependency direction is:

```text
UI components
  → custom hooks
  → document workflow/orchestration
  → DocumentApi interface
  → mock adapter (today)
  → API Gateway adapter (future)
```

Visual components do not know whether data comes from mock timers or HTTP polling. This is the main migration boundary.

## Configuration and data modes

Public configuration is defined in `lib/config/environment.ts`.

```env
NEXT_PUBLIC_DATA_MODE=mock
NEXT_PUBLIC_API_BASE_URL=
```

Supported data modes:

- `mock` — default and currently active. Uses typed in-browser fixtures and simulated latency.
- `api` — reserved for the backend phase. It currently returns a clear not-connected error and makes no AWS request.

`NEXT_PUBLIC_API_BASE_URL` will eventually contain the public API Gateway base URL. It is intentionally empty now. Only public, browser-safe configuration may use `NEXT_PUBLIC_*`; AWS credentials and secrets must never be placed there.

Next.js inlines these public variables at build time, so a deployment must be rebuilt when they change.

## TypeScript contracts

Contracts live in `lib/contracts/`:

- `document.ts` — `DocumentRecord`, `DocumentStatus`, `ProcessingStage`, and processing updates.
- `extraction.ts` — fields, tables, geometry, queries, signatures, and normalized extraction results.
- `api.ts` — the common `ApiResponse<T>` and `ApiError` envelopes.

Canonical document statuses are:

```text
IDLE | UPLOADING | PROCESSING | COMPLETED | FAILED
```

Processing stages are:

```text
SCANNING | ANALYZING | EXTRACTING | VERIFYING
```

Stages provide detailed UI feedback while the stable backend status remains `PROCESSING`.

## Service interface

`DocumentApi` in `lib/api/documents.ts` defines the backend-shaped operations:

| Operation | Responsibility |
| --- | --- |
| `listDocuments()` | Return document metadata records. |
| `getDocument(id)` | Return one document record or `null`. |
| `requestUpload(input)` | Request a destination and provisional document ID. |
| `uploadToDestination(destination, file)` | Transfer bytes to the supplied destination. Future implementation uploads directly to S3, not through API Gateway. |
| `confirmUpload(input)` | Confirm the uploaded object and document record. |
| `startProcessing(input)` | Start an asynchronous processing job. |
| `getProcessingStatus(id)` | Return canonical status, visual stage, progress, and job information. |
| `getExtractionResult(id)` | Return normalized extraction output when available. |
| `retryProcessing(id)` | Start a new attempt for a failed document. |

The existing UI-facing `documentWorkflow.processDocument()` is a convenience orchestrator. It composes these operations so `UploadWorkspace` does not need to change when the real adapter arrives.

## Upload workflow

Today's mock and the future production flow share the same sequence:

```text
1. Validate file locally
2. requestUpload()
3. uploadToDestination()
4. confirmUpload()
5. startProcessing()
6. monitor getProcessingStatus()
7. getDocument() + getExtractionResult()
```

In mock mode, the destination uses a `mock://` URL and no bytes leave the browser. In production, `requestUpload()` is expected to return a short-lived S3 pre-signed URL. The browser then uploads directly to S3.

## Processing and polling

`lib/api/processing-monitor.ts` owns status monitoring. Hooks receive status updates through a callback and do not implement polling themselves.

The monitor only depends on `getProcessingStatus()`. Therefore the status source can later be:

- deterministic mock state transitions;
- API Gateway polling;
- or a future event-driven adapter that preserves the same observable contract.

Polling is bounded and abortable. A terminal `COMPLETED` or `FAILED` status stops monitoring. Timeouts become typed service errors rather than endless loops.

## Current mock adapter

`lib/mocks/document-api.ts` implements every `DocumentApi` operation. It stores typed records in memory, uses Promise/setTimeout latency, and advances jobs deterministically through:

```text
IDLE
→ UPLOADING
→ PROCESSING / SCANNING
→ PROCESSING / ANALYZING
→ PROCESSING / EXTRACTING
→ PROCESSING / VERIFYING
→ COMPLETED
```

A controlled `shouldFail` option produces `FAILED`. Retry creates a new mock job and follows the same service contract. Random failures are intentionally avoided so demonstrations remain predictable.

## Future API Gateway adapter

`lib/api/api-gateway-document-api.ts` is the inactive replacement boundary. During the backend phase it will implement `DocumentApi` using the centralized client from `lib/api/client.ts`.

The migration should be limited to the adapter and deployment configuration:

1. Implement the HTTP calls in the API Gateway adapter.
2. Configure `NEXT_PUBLIC_API_BASE_URL`.
3. Build with `NEXT_PUBLIC_DATA_MODE=api`.
4. Keep hooks and visual components unchanged.

Potential REST resources may include:

```text
GET  /documents
GET  /documents/{documentId}
POST /documents/upload-url
POST /documents/{documentId}/confirm-upload
POST /documents/{documentId}/process
GET  /documents/{documentId}/status
GET  /documents/{documentId}/extraction
POST /documents/{documentId}/retry
```

These routes are documentation only and do not exist in the current frontend.

## AWS responsibility mapping

| Layer | Future responsibility |
| --- | --- |
| Next.js frontend | File validation, direct pre-signed upload, status presentation, review, and export. |
| API Gateway | Public REST boundary and request/response routing. |
| AWS Lambda | Validation, upload authorization, job orchestration, status updates, and result normalization. |
| Amazon S3 | Raw PDF/image object storage and pre-signed upload destination. |
| Amazon Textract | Asynchronous OCR, forms, tables, queries, signatures, and layout analysis. |
| Amazon DynamoDB | Document metadata, job status, normalized results, timestamps, and review history. |

The frontend must never receive AWS credentials. Backend validation remains authoritative even though the frontend performs local validation for usability.

## Viva summary

The project behaves like a full asynchronous document system without claiming that AWS is connected. TypeScript contracts describe future JSON payloads, the service interface isolates infrastructure, the mock adapter provides deterministic behavior, and hooks translate service state into UI state. Replacing the mock adapter with an API Gateway adapter is the intended production migration path.

