import { ApiServiceError, createApiClient } from "@/lib/api/client";
import type { DocumentApi } from "@/lib/api/documents";

function notConnected(): never {
  throw new ApiServiceError({
    code: "API_ADAPTER_NOT_CONNECTED",
    message: "API mode is reserved for the backend phase. No API Gateway endpoint is connected yet.",
    status: 503,
  });
}

/**
 * Deliberately inactive adapter boundary for Phase 2. The client is constructed
 * with the future base URL, but operations remain disabled until AWS integration
 * is explicitly started.
 */
export function createApiGatewayDocumentApi(apiBaseUrl: string | null): DocumentApi {
  createApiClient(apiBaseUrl);
  return {
    listDocuments: async () => notConnected(),
    getDocument: async () => notConnected(),
    requestUpload: async () => notConnected(),
    uploadToDestination: async () => notConnected(),
    confirmUpload: async () => notConnected(),
    startProcessing: async () => notConnected(),
    getProcessingStatus: async () => notConnected(),
    getExtractionResult: async () => notConnected(),
    retryProcessing: async () => notConnected(),
  };
}

