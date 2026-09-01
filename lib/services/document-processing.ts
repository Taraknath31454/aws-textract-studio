import { demoDocuments, invoiceResult } from "@/lib/mock/data";
import type { DocumentRecord, ExtractionResult, ExtractionMode, ExtractionProfile } from "@/lib/types";

export interface ProcessingRequest { file?: File; demoDocumentId?: string; mode: ExtractionMode; profile: string; queries: ExtractionProfile["queries"] }
export interface DocumentProcessingService {
  listDocuments(): Promise<DocumentRecord[]>;
  getDocument(id: string): Promise<{ document: DocumentRecord; result: ExtractionResult } | null>;
  process(request: ProcessingRequest, onProgress?: (progress: number) => void): Promise<string>;
}

const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export class DemoDocumentProcessingService implements DocumentProcessingService {
  async listDocuments() { return demoDocuments; }
  async getDocument(id: string) {
    const document = demoDocuments.find((item) => item.id === id);
    return document ? { document, result: { ...invoiceResult, documentId: id, documentType: document.type, pages: document.pages, overallConfidence: document.confidence } } : null;
  }
  async process(_request: ProcessingRequest, onProgress?: (progress: number) => void) {
    for (const progress of [12, 29, 48, 68, 84, 100]) { await pause(380); onProgress?.(progress); }
    return "demo-001";
  }
}

// Replace this instance with an AWS-backed implementation when the backend exists.
export const documentProcessingService: DocumentProcessingService = new DemoDocumentProcessingService();

