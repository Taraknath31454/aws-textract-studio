// Compatibility export for callers migrating from the original service module.
export { documentWorkflow as documentProcessingService } from "@/lib/api/document-workflow";
export type { ProcessDocumentRequest as ProcessingRequest } from "@/lib/api/documents";
export type DocumentProcessingService = typeof import("@/lib/api/document-workflow").documentWorkflow;
