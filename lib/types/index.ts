export type DocumentStatus = "Completed" | "Processing" | "Needs Review" | "Failed";
export type DocumentType = "Invoice" | "Application" | "Contract" | "Business Document";
export type ExtractionMode = "Automatic" | "Text Detection" | "Forms" | "Tables" | "Queries" | "Signatures" | "Layout" | "Invoice / Receipt";
export type ConfidenceLevel = "high" | "medium" | "low";
export type ReviewStatus = "Pending" | "Approved" | "Edited" | "Flagged" | "Skipped";

export interface BoundingBox { left: number; top: number; width: number; height: number; page: number }

export interface ExtractedField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  boundingBox: BoundingBox;
  sensitive?: boolean;
  reviewStatus?: ReviewStatus;
}

export interface ExtractedTable {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
  confidence: number;
}

export interface TextractQuery { id: string; question: string; alias: string; pages: string }
export interface QueryAnswer extends TextractQuery { answer: string; confidence: number; boundingBox: BoundingBox }
export interface SignatureResult { id: string; page: number; confidence: number; boundingBox: BoundingBox; status: ReviewStatus }
export interface AuditEvent { id: string; timestamp: string; action: string; detail: string; actor: "Textract" | "System" | "Reviewer" }

export interface ExtractionResult {
  documentId: string;
  documentType: DocumentType;
  pages: number;
  processingTime: string;
  overallConfidence: number;
  fullText: string;
  fields: ExtractedField[];
  tables: ExtractedTable[];
  queries: QueryAnswer[];
  signatures: SignatureResult[];
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: DocumentType;
  pages: number;
  mode: ExtractionMode;
  confidence: number;
  status: DocumentStatus;
  uploadedAt: string;
  size: string;
  tags: string[];
}

export interface ReviewItem {
  id: string;
  documentId: string;
  documentName: string;
  field: string;
  machineValue: string;
  reviewedValue?: string;
  confidence: number;
  page: number;
  reason: string;
  status: ReviewStatus;
  updatedAt?: string;
  audit: AuditEvent[];
}

export interface ExtractionProfile {
  id: string;
  name: string;
  features: ExtractionMode[];
  queries: TextractQuery[];
  confidenceThreshold: number;
  autoReview: boolean;
}

export interface UserSettings {
  appearance: "system" | "dark" | "light";
  confidenceThreshold: number;
  autoReview: boolean;
  privacyMode: boolean;
  exportFormat: "json" | "csv" | "txt";
}

