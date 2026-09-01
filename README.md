# Textract Studio

Textract Studio is a production-style frontend demonstration of an intelligent document-processing workspace built around Amazon Textract concepts. It is designed for university evaluation and product demos while remaining usable without AWS credentials or backend infrastructure.

> Current status: **Frontend Demo Mode**. Files are not sent to AWS or any third party, and all extraction results are realistic mock data.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4 plus a custom responsive design system
- Lucide React icons
- Browser `localStorage` for demo preferences, profiles, review corrections, and document metadata

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production verification:

```bash
npm run lint
npm run build
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page and visual AWS workflow |
| `/dashboard` | Document intelligence overview |
| `/upload` | Upload, preflight, extraction configuration, and pipeline simulation |
| `/documents` | Searchable document repository |
| `/documents/[id]` | Split-screen result workspace |
| `/review` | Confidence-Guided Review and audit trail |
| `/query-lab` | Textract query/profile builder |
| `/analytics` | Processing and extraction-quality analytics |
| `/settings` | Appearance, review, demo, and export preferences |
| `/login` | Frontend-only sign-in experience |
| `/signup` | Two-step account creation with interactive mascot |
| `/forgot-password` | Honest demo password-reset state |

## Major frontend features

- Source Trace: extracted values highlight normalized bounding-box locations in the document viewer.
- Confidence Heatmap with high, medium, and low-confidence regions.
- Confidence-Guided Review with approve, edit, flag, skip, and a machine-versus-human audit trail.
- Upload preflight based only on local file metadata, with explicit limitations.
- Extraction Profiles and Query Lab saved locally in the browser.
- Interactive browser-only processing simulation across S3, Lambda, Textract, normalization, and review stages.
- Result views for text, fields, tables, queries, signatures, layout, and normalized JSON.
- Local JSON, CSV, and TXT downloads without API endpoints.
- Privacy Presentation Mode that masks sensitive-looking values in the interface. It is not PII detection.
- Responsive dark/light workspace, keyboard focus states, loading, empty, error, toast, and confirmation states.
- Frontend-only authentication pages with accessible password controls and a ref-driven, reduced-motion-aware mascot eye interaction. Credentials are never persisted.

Three demo document types are included: invoice, application form, and contract/business documents. For the fastest judge flow, use **Try Demo Document** on `/upload` or open `/documents/demo-001`.

## Frontend architecture

Typed models and mock data live under `lib/types` and `lib/mock`. UI code accesses processing through the `DocumentProcessingService` interface in `lib/services/document-processing.ts`. The current `DemoDocumentProcessingService` performs a short browser simulation. A future backend adapter can implement the same interface without redesigning the pages.

No uploaded file contents are stored in `localStorage`; only small demo settings and metadata are persisted.

## Future AWS architecture

The intended production workflow is:

```text
Frontend → backend/API → Amazon S3 → AWS Lambda → Amazon Textract
         → result normalization → DynamoDB → frontend review/export
```

For large or multi-page asynchronous work, the architecture can use `StartDocumentAnalysis`, Amazon SNS/SQS and Lambda orchestration, then `GetDocumentAnalysis` before normalization and persistence. Invoice/receipt profiles can map to `AnalyzeExpense`.

AWS credentials must never be exposed in the frontend. S3, Lambda, Textract, SNS/SQS, DynamoDB, Cognito, and API Gateway are intentionally not configured in this phase.
