import { ApiServiceError } from "@/lib/api/client";
import { documentApi, type ProcessDocumentOptions, type ProcessDocumentRequest, type ProcessedDocument } from "@/lib/api/documents";
import { monitorProcessing } from "@/lib/api/processing-monitor";

function emitUpload(documentId: string, progress: number, message: string, onUpdate: ProcessDocumentOptions["onUpdate"]) {
  onUpdate?.({ documentId, status: "UPLOADING", progress, message });
}

export const documentWorkflow = {
  async processDocument(request: ProcessDocumentRequest, options: ProcessDocumentOptions = {}): Promise<ProcessedDocument> {
    const { signal, onUpdate } = options;
    let documentId: string;

    if (request.retryDocumentId) {
      const retry = await documentApi.retryProcessing(request.retryDocumentId, signal);
      documentId = retry.data.documentId;
    } else {
      const destination = await documentApi.requestUpload({
        fileName: request.file?.name ?? "Demo_Invoice.pdf",
        fileType: request.file?.type || "application/pdf",
        fileSize: request.file?.size ?? 1_887_437,
        mode: request.mode,
        profile: request.profile,
        queries: request.queries,
        documentType: request.documentType,
        demoDocumentId: request.demoDocumentId,
      }, signal);
      documentId = destination.data.documentId;
      emitUpload(documentId, 5, "Upload destination prepared.", onUpdate);
      await documentApi.uploadToDestination(destination.data, request.file, {
        signal,
        onProgress: (progress) => emitUpload(documentId, progress, "Uploading document bytes.", onUpdate),
      });
      await documentApi.confirmUpload({ documentId, objectKey: destination.data.objectKey }, signal);
      await documentApi.startProcessing({ documentId, mode: request.mode, profile: request.profile, queries: request.queries, shouldFail: request.shouldFail }, signal);
    }

    const finalStatus = await monitorProcessing(documentApi, documentId, {
      signal,
      onStatus: ({ status, stage, progress, message }) => onUpdate?.({ documentId, status, stage, progress, message }),
    });
    if (finalStatus.status === "FAILED") throw new ApiServiceError({ code: "PROCESSING_FAILED", message: finalStatus.message, status: 500 });

    const [documentResponse, extractionResponse] = await Promise.all([
      documentApi.getDocument(documentId, signal),
      documentApi.getExtractionResult(documentId, signal),
    ]);
    if (!documentResponse.data || !extractionResponse.data) throw new ApiServiceError({ code: "PROCESSING_RESULT_MISSING", message: "Processing completed but the normalized result is unavailable." });
    return { document: documentResponse.data, extraction: extractionResponse.data };
  },
};

