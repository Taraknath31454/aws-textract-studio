# Textract Studio

Textract Studio is a document-processing workspace backed by Amazon Textract, with an optional local mock mode for development and demonstrations.

> Current configuration: **Live AWS API mode**. Uploads use presigned S3 URLs and document metadata/results are loaded through the configured API Gateway endpoint.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4 plus a custom responsive design system
- Lucide React icons
- Browser `localStorage` for preferences, profiles, and review corrections; document metadata is stored locally only in mock mode

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
| `/upload` | Upload, preflight, extraction configuration, and AWS processing workflow |
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
- Live presigned-S3 upload and AWS processing workflow in API mode, with a browser-only simulator retained for mock mode.
- Result views for text, fields, tables, queries, signatures, layout, and normalized JSON.
- Local JSON, CSV, and TXT downloads without API endpoints.
- Privacy Presentation Mode that masks sensitive-looking values in the interface. It is not PII detection.
- Responsive dark/light workspace, keyboard focus states, loading, empty, error, toast, and confirmation states.
- Frontend-only authentication pages with accessible password controls and a ref-driven, reduced-motion-aware mascot eye interaction. Credentials are never persisted.

Three demo document types are included: invoice, application form, and contract/business documents. For the fastest judge flow, use **Try Demo Document** on `/upload` or open `/documents/demo-001`.

## Frontend architecture

Typed contracts and adapters live under `lib`. The active `DocumentApi` is selected by `NEXT_PUBLIC_DATA_MODE`: `api` uses API Gateway plus a direct presigned S3 PUT, while `mock` keeps the local simulator available.

No uploaded file contents are stored in `localStorage`. In API mode, browser-stored document metadata cannot replace records returned by the AWS API.

## AWS architecture

The intended production workflow is:

```text
Frontend → backend/API → Amazon S3 → AWS Lambda → Amazon Textract
         → result normalization → DynamoDB → frontend review/export
```

AWS credentials are never exposed in the frontend. The browser receives only short-lived upload destinations from the API.
