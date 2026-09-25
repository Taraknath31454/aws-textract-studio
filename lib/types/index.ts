export type {
  DocumentRecord,
  DocumentStatus,
  DocumentType,
  ExtractionMode,
  ProcessingStage,
  ProcessingUpdate,
} from "@/lib/contracts/document";
export type {
  BoundingBox,
  ConfidenceLevel,
  ExtractedField,
  ExtractedTable,
  ExtractionResult,
  QueryAnswer,
  ReviewStatus,
  SignatureResult,
  TextractQuery,
} from "@/lib/contracts/extraction";
export type { ApiError, ApiFailureResponse, ApiResponse } from "@/lib/contracts/api";

import type { ExtractionMode } from "@/lib/contracts/document";
import type { ReviewStatus, TextractQuery } from "@/lib/contracts/extraction";

export interface AuditEvent { id: string; timestamp: string; action: string; detail: string; actor: "Textract" | "System" | "Reviewer" }

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
