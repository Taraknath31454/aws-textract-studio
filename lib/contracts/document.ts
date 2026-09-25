export type DocumentStatus = "IDLE" | "UPLOADING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type ProcessingStage = "SCANNING" | "ANALYZING" | "EXTRACTING" | "VERIFYING";

export type DocumentType = "Invoice" | "Application" | "Contract" | "Business Document";

export type ExtractionMode =
  | "Automatic"
  | "Text Detection"
  | "Forms"
  | "Tables"
  | "Queries"
  | "Signatures"
  | "Layout"
  | "Invoice / Receipt";

export interface DocumentRecord {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: DocumentType;
  pageCount: number;
  extractionMode: ExtractionMode;
  status: DocumentStatus;
  processingStage?: ProcessingStage;
  confidence?: number;
  reviewRequired: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingUpdate {
  documentId: string;
  status: DocumentStatus;
  stage?: ProcessingStage;
  progress: number;
  message: string;
}

