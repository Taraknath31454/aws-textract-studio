import { apiSuccess, ApiServiceError } from "@/lib/api/client";
import type { DocumentApi, ProcessingStatusResult, StartProcessingInput } from "@/lib/api/documents";
import type { DocumentRecord, ProcessingStage } from "@/lib/contracts/document";
import type { ExtractionResult } from "@/lib/contracts/extraction";
import { mockDocuments } from "@/lib/mocks/documents";
import { mockInvoiceExtraction } from "@/lib/mocks/extraction";

interface MockJob {
  documentId: string;
  jobId: string;
  cursor: number;
  shouldFail: boolean;
  createdAt: string;
}

const documents = new Map(mockDocuments.map((document) => [document.id, { ...document, tags: [...document.tags] }]));
const results = new Map<string, ExtractionResult>([[mockInvoiceExtraction.documentId, mockInvoiceExtraction]]);
const jobs = new Map<string, MockJob>();

const processingSequence: Array<{ stage?: ProcessingStage; status: DocumentRecord["status"]; progress: number; message: string }> = [
  { status: "PROCESSING", stage: "SCANNING", progress: 43, message: "Scanning document pages." },
  { status: "PROCESSING", stage: "ANALYZING", progress: 61, message: "Analyzing layout and text blocks." },
  { status: "PROCESSING", stage: "EXTRACTING", progress: 79, message: "Extracting structured fields and tables." },
  { status: "PROCESSING", stage: "VERIFYING", progress: 92, message: "Verifying confidence and review rules." },
  { status: "COMPLETED", progress: 100, message: "Processing complete." },
];

function pause(milliseconds: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("The request was cancelled.", "AbortError"));
      return;
    }
    const finish = () => {
      signal?.removeEventListener("abort", abort);
      resolve();
    };
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("The request was cancelled.", "AbortError"));
    };
    const timer = setTimeout(finish, milliseconds);
    signal?.addEventListener("abort", abort, { once: true });
  });
}

function cloneDocument(document: DocumentRecord): DocumentRecord {
  return { ...document, tags: [...document.tags] };
}

function requireDocument(documentId: string) {
  const document = documents.get(documentId);
  if (!document) throw new ApiServiceError({ code: "DOCUMENT_NOT_FOUND", message: `No mock document matches ${documentId}.`, status: 404 });
  return document;
}

function createExtraction(document: DocumentRecord): ExtractionResult {
  return {
    ...mockInvoiceExtraction,
    documentId: document.id,
    documentType: document.documentType,
    pages: document.pageCount,
    overallConfidence: document.confidence ?? mockInvoiceExtraction.overallConfidence,
    createdAt: document.updatedAt,
    fields: mockInvoiceExtraction.fields.map((field) => ({ ...field, boundingBox: field.boundingBox ? { ...field.boundingBox } : undefined })),
    tables: mockInvoiceExtraction.tables.map((table) => ({ ...table, headers: [...table.headers], rows: table.rows.map((row) => [...row]) })),
    queries: mockInvoiceExtraction.queries.map((query) => ({ ...query, boundingBox: { ...query.boundingBox } })),
    signatures: mockInvoiceExtraction.signatures.map((signature) => ({ ...signature, boundingBox: { ...signature.boundingBox } })),
  };
}

function createJob(input: Pick<StartProcessingInput, "documentId" | "shouldFail">): MockJob {
  const createdAt = new Date().toISOString();
  const job = { documentId: input.documentId, jobId: `mock-job-${input.documentId}-${Date.now()}`, cursor: 0, shouldFail: Boolean(input.shouldFail), createdAt };
  jobs.set(input.documentId, job);
  return job;
}

function toStatus(job: MockJob, document: DocumentRecord, progress: number, message: string): ProcessingStatusResult {
  return { documentId: document.id, jobId: job.jobId, status: document.status, stage: document.processingStage, progress, message, resultAvailable: document.status === "COMPLETED" };
}

export const mockDocumentApi: DocumentApi = {
  async listDocuments(signal) {
    await pause(320, signal);
    return apiSuccess([...documents.values()].map(cloneDocument), "Mock documents loaded.");
  },

  async getDocument(id, signal) {
    await pause(180, signal);
    const document = documents.get(id);
    return apiSuccess(document ? cloneDocument(document) : null);
  },

  async requestUpload(input, signal) {
    await pause(180, signal);
    const now = new Date().toISOString();
    const existing = input.demoDocumentId ? documents.get(input.demoDocumentId) : undefined;
    const document: DocumentRecord = existing ? cloneDocument(existing) : {
      id: `local-${Date.now()}`,
      fileName: input.fileName,
      fileType: input.fileType,
      fileSize: input.fileSize,
      documentType: input.documentType ?? (input.profile.includes("Invoice") ? "Invoice" : "Business Document"),
      pageCount: input.fileType === "application/pdf" ? 2 : 1,
      extractionMode: input.mode,
      status: "IDLE",
      confidence: undefined,
      reviewRequired: false,
      tags: input.demoDocumentId ? ["invoice", "demo"] : ["local"],
      createdAt: now,
      updatedAt: now,
    };
    document.status = "IDLE";
    document.processingStage = undefined;
    documents.set(document.id, document);
    return apiSuccess({
      documentId: document.id,
      objectKey: `mock-uploads/${document.id}/${document.fileName}`,
      uploadUrl: `mock://uploads/${document.id}`,
      method: "PUT" as const,
      headers: { "Content-Type": document.fileType },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }, "Mock upload destination prepared.");
  },

  async uploadToDestination(destination, _file, options = {}) {
    const document = requireDocument(destination.documentId);
    document.status = "UPLOADING";
    document.updatedAt = new Date().toISOString();
    for (const progress of [12, 27]) {
      await pause(220, options.signal);
      options.onProgress?.(progress);
    }
    return apiSuccess(undefined, "Mock upload completed in browser memory.");
  },

  async confirmUpload(input, signal) {
    await pause(140, signal);
    const document = requireDocument(input.documentId);
    document.status = "UPLOADING";
    document.updatedAt = new Date().toISOString();
    return apiSuccess(cloneDocument(document), "Mock document record confirmed.");
  },

  async startProcessing(input, signal) {
    await pause(160, signal);
    const document = requireDocument(input.documentId);
    document.status = "PROCESSING";
    document.processingStage = "SCANNING";
    document.updatedAt = new Date().toISOString();
    const job = createJob(input);
    return apiSuccess({ documentId: job.documentId, jobId: job.jobId, status: document.status, stage: document.processingStage, createdAt: job.createdAt }, "Mock processing job started.");
  },

  async getProcessingStatus(documentId, signal) {
    await pause(120, signal);
    const document = requireDocument(documentId);
    const job = jobs.get(documentId);
    if (!job) throw new ApiServiceError({ code: "PROCESSING_JOB_NOT_FOUND", message: "No active mock processing job exists for this document.", status: 404 });

    if (job.shouldFail && job.cursor >= 2) {
      document.status = "FAILED";
      document.updatedAt = new Date().toISOString();
      return apiSuccess(toStatus(job, document, 61, "Document analysis failed in the controlled demo path."));
    }

    const step = processingSequence[Math.min(job.cursor, processingSequence.length - 1)];
    job.cursor += 1;
    document.status = step.status;
    document.processingStage = step.stage;
    document.updatedAt = new Date().toISOString();
    if (document.status === "COMPLETED") {
      document.confidence = 94.8;
      document.reviewRequired = true;
      results.set(document.id, createExtraction(document));
    }
    return apiSuccess(toStatus(job, document, step.progress, step.message));
  },

  async getExtractionResult(documentId, signal) {
    await pause(220, signal);
    const stored = results.get(documentId);
    if (stored) return apiSuccess(createExtraction(documents.get(documentId) ?? mockDocuments[0]));
    const document = documents.get(documentId);
    if (!document && documentId.startsWith("local-")) return apiSuccess(createExtraction({ ...mockDocuments[0], id: documentId }));
    return apiSuccess(document?.status === "COMPLETED" ? createExtraction(document) : null);
  },

  async retryProcessing(documentId, signal) {
    await pause(160, signal);
    const document = requireDocument(documentId);
    document.status = "PROCESSING";
    document.processingStage = "SCANNING";
    document.updatedAt = new Date().toISOString();
    const job = createJob({ documentId, shouldFail: false });
    return apiSuccess({ documentId: job.documentId, jobId: job.jobId, status: document.status, stage: document.processingStage, createdAt: job.createdAt }, "Mock processing retry started.");
  },
};

