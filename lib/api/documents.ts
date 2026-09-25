import type { ApiResponse } from "@/lib/contracts/api";
import type { DocumentRecord, DocumentStatus, DocumentType, ExtractionMode, ProcessingStage, ProcessingUpdate } from "@/lib/contracts/document";
import type { ExtractionProfile, ExtractionResult } from "@/lib/types";
import { publicEnvironment } from "@/lib/config/environment";
import { mockDocumentApi } from "@/lib/mocks/document-api";
import { createApiGatewayDocumentApi } from "@/lib/api/api-gateway-document-api";

export interface RequestUploadInput {
  fileName: string;
  fileType: string;
  fileSize: number;
  mode: ExtractionMode;
  profile: string;
  queries: ExtractionProfile["queries"];
  documentType?: DocumentType;
  demoDocumentId?: string;
}

export interface UploadDestination {
  documentId: string;
  objectKey: string;
  uploadUrl: string;
  method: "PUT";
  headers: Record<string, string>;
  expiresAt: string;
}

export interface UploadTransferOptions {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

export interface ConfirmUploadInput {
  documentId: string;
  objectKey: string;
}

export interface StartProcessingInput {
  documentId: string;
  mode: ExtractionMode;
  profile: string;
  queries: ExtractionProfile["queries"];
  shouldFail?: boolean;
}

export interface ProcessingJob {
  documentId: string;
  jobId: string;
  status: DocumentStatus;
  stage?: ProcessingStage;
  createdAt: string;
}

export interface ProcessingStatusResult extends ProcessingUpdate {
  jobId: string;
  resultAvailable: boolean;
}

export interface ProcessDocumentRequest {
  file?: File;
  demoDocumentId?: string;
  retryDocumentId?: string;
  mode: ExtractionMode;
  profile: string;
  queries: ExtractionProfile["queries"];
  documentType?: DocumentType;
  shouldFail?: boolean;
}

export interface ProcessedDocument {
  document: DocumentRecord;
  extraction: ExtractionResult;
}

export interface ProcessDocumentOptions {
  signal?: AbortSignal;
  onUpdate?: (update: ProcessingUpdate) => void;
}

/**
 * Backend-shaped operations. The active implementation is selected once at
 * the adapter boundary; UI components and hooks do not branch on data mode.
 */
export interface DocumentApi {
  listDocuments(signal?: AbortSignal): Promise<ApiResponse<DocumentRecord[]>>;
  getDocument(id: string, signal?: AbortSignal): Promise<ApiResponse<DocumentRecord | null>>;
  requestUpload(input: RequestUploadInput, signal?: AbortSignal): Promise<ApiResponse<UploadDestination>>;
  uploadToDestination(destination: UploadDestination, file: File | undefined, options?: UploadTransferOptions): Promise<ApiResponse<void>>;
  confirmUpload(input: ConfirmUploadInput, signal?: AbortSignal): Promise<ApiResponse<DocumentRecord>>;
  startProcessing(input: StartProcessingInput, signal?: AbortSignal): Promise<ApiResponse<ProcessingJob>>;
  getProcessingStatus(documentId: string, signal?: AbortSignal): Promise<ApiResponse<ProcessingStatusResult>>;
  getExtractionResult(documentId: string, signal?: AbortSignal): Promise<ApiResponse<ExtractionResult | null>>;
  retryProcessing(documentId: string, signal?: AbortSignal): Promise<ApiResponse<ProcessingJob>>;
}

const apiGatewayDocumentApi = createApiGatewayDocumentApi(publicEnvironment.apiBaseUrl);

// Mock is the default. API mode intentionally remains an inactive readiness boundary.
export const documentApi: DocumentApi = publicEnvironment.dataMode === "api" ? apiGatewayDocumentApi : mockDocumentApi;

