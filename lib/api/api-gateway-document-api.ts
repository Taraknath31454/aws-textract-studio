import { apiSuccess, ApiServiceError, createApiClient } from "@/lib/api/client";
import type { DocumentApi, ProcessingJob, ProcessingStatusResult, UploadDestination } from "@/lib/api/documents";
import type { DocumentRecord } from "@/lib/contracts/document";
import type { ExtractionResult } from "@/lib/contracts/extraction";

function documentPath(documentId: string, suffix = "") {
  return `/documents/${encodeURIComponent(documentId)}${suffix}`;
}

export function createApiGatewayDocumentApi(apiBaseUrl: string | null): DocumentApi {
  const client = createApiClient(apiBaseUrl);
  return {
    listDocuments(signal) {
      return client.request<DocumentRecord[]>("/documents", { signal });
    },
    getDocument(documentId, signal) {
      return client.request<DocumentRecord | null>(documentPath(documentId), { signal });
    },
    requestUpload(input, signal) {
      return client.request<UploadDestination>("/documents/upload-url", { method: "POST", body: JSON.stringify(input), signal });
    },
    async uploadToDestination(destination, file, options = {}) {
      if (!file) throw new ApiServiceError({ code: "UPLOAD_FILE_REQUIRED", message: "Choose a document before starting a real AWS upload.", status: 400 });
      options.onProgress?.(10);
      const response = await fetch(destination.uploadUrl, {
        method: destination.method,
        headers: destination.headers,
        body: file,
        signal: options.signal,
      });
      if (!response.ok) throw new ApiServiceError({ code: "S3_UPLOAD_FAILED", message: `The direct S3 upload failed with status ${response.status}.`, status: response.status });
      options.onProgress?.(100);
      return apiSuccess(undefined, "Document uploaded directly to S3.");
    },
    confirmUpload(input, signal) {
      return client.request<DocumentRecord>(documentPath(input.documentId, "/confirm-upload"), { method: "POST", body: JSON.stringify(input), signal });
    },
    startProcessing(input, signal) {
      const { documentId, ...body } = input;
      return client.request<ProcessingJob>(documentPath(documentId, "/process"), { method: "POST", body: JSON.stringify(body), signal });
    },
    getProcessingStatus(documentId, signal) {
      return client.request<ProcessingStatusResult>(documentPath(documentId, "/status"), { signal });
    },
    getExtractionResult(documentId, signal) {
      return client.request<ExtractionResult | null>(documentPath(documentId, "/extraction"), { signal });
    },
    retryProcessing(documentId, signal) {
      return client.request<ProcessingJob>(documentPath(documentId, "/retry"), { method: "POST", signal });
    },
  };
}

