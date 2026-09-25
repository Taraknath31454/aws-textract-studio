import type { DocumentRecord, DocumentStatus, DocumentType, ExtractionMode, ProcessingStage } from "@/lib/contracts/document";

const statuses: DocumentStatus[] = ["IDLE", "UPLOADING", "PROCESSING", "COMPLETED", "FAILED"];
const stages: ProcessingStage[] = ["SCANNING", "ANALYZING", "EXTRACTING", "VERIFYING"];
const documentTypes: DocumentType[] = ["Invoice", "Application", "Contract", "Business Document"];

export function getDocumentStatusLabel(document: Pick<DocumentRecord, "status" | "processingStage" | "reviewRequired">) {
  if (document.status === "COMPLETED" && document.reviewRequired) return "Needs Review";
  if (document.status === "PROCESSING" && document.processingStage) return document.processingStage[0] + document.processingStage.slice(1).toLowerCase();
  return document.status[0] + document.status.slice(1).toLowerCase();
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDocumentDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(isoDate));
}

function isString(value: unknown): value is string { return typeof value === "string"; }
function isNumber(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }

export function migrateDocumentRecord(value: unknown): DocumentRecord | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = isString(record.id) ? record.id : null;
  const fileName = isString(record.fileName) ? record.fileName : isString(record.name) ? record.name : null;
  if (!id || !fileName) return null;

  const rawStatus = isString(record.status) ? record.status : "IDLE";
  const status: DocumentStatus = statuses.includes(rawStatus as DocumentStatus)
    ? rawStatus as DocumentStatus
    : rawStatus === "Failed" ? "FAILED"
      : rawStatus === "Processing" ? "PROCESSING"
        : "COMPLETED";
  const rawStage = isString(record.processingStage) ? record.processingStage : undefined;
  const processingStage = stages.includes(rawStage as ProcessingStage) ? rawStage as ProcessingStage : undefined;
  const rawType = isString(record.documentType) ? record.documentType : isString(record.type) ? record.type : "Business Document";
  const documentType = documentTypes.includes(rawType as DocumentType) ? rawType as DocumentType : "Business Document";
  const extractionMode = (isString(record.extractionMode) ? record.extractionMode : isString(record.mode) ? record.mode : "Automatic") as ExtractionMode;
  const createdAt = isString(record.createdAt) ? record.createdAt : new Date().toISOString();
  const legacySize = isString(record.size) ? Number.parseFloat(record.size) * (record.size.includes("KB") ? 1024 : 1024 * 1024) : 0;

  return {
    id,
    fileName,
    fileType: isString(record.fileType) ? record.fileType : fileName.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream",
    fileSize: isNumber(record.fileSize) ? record.fileSize : Number.isFinite(legacySize) ? legacySize : 0,
    documentType,
    pageCount: isNumber(record.pageCount) ? record.pageCount : isNumber(record.pages) ? record.pages : 1,
    extractionMode,
    status,
    processingStage,
    confidence: isNumber(record.confidence) ? record.confidence : undefined,
    reviewRequired: typeof record.reviewRequired === "boolean" ? record.reviewRequired : rawStatus === "Needs Review",
    tags: Array.isArray(record.tags) ? record.tags.filter(isString) : [],
    createdAt,
    updatedAt: isString(record.updatedAt) ? record.updatedAt : createdAt,
  };
}

export function migrateDocumentRecords(value: unknown): DocumentRecord[] {
  if (!Array.isArray(value)) return [];
  return value.map(migrateDocumentRecord).filter((document): document is DocumentRecord => Boolean(document));
}

