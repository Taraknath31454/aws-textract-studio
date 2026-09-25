import type { DocumentType } from "@/lib/contracts/document";

export type ConfidenceLevel = "high" | "medium" | "low";
export type ReviewStatus = "Pending" | "Approved" | "Edited" | "Flagged" | "Skipped";

export interface BoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
  page: number;
}

export interface ExtractedField {
  id: string;
  key: string;
  value: string;
  confidence?: number;
  boundingBox?: BoundingBox;
  sensitive?: boolean;
  reviewStatus?: ReviewStatus;
}

export interface ExtractedTable {
  id: string;
  title?: string;
  headers: string[];
  rows: string[][];
  confidence?: number;
}

export interface TextractQuery {
  id: string;
  question: string;
  alias: string;
  pages: string;
}

export interface QueryAnswer extends TextractQuery {
  answer: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface SignatureResult {
  id: string;
  page: number;
  confidence: number;
  boundingBox: BoundingBox;
  status: ReviewStatus;
}

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
  createdAt: string;
}

