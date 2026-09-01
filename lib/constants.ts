import type { ExtractionMode } from "@/lib/types";

export const PRODUCT = { name: "Textract Studio", subtitle: "Intelligent Document Processing Workspace" } as const;

export const DOCUMENT_RULES = {
  acceptedExtensions: [".pdf", ".png", ".jpg", ".jpeg", ".tif", ".tiff"],
  acceptedMimeTypes: ["application/pdf", "image/png", "image/jpeg", "image/tiff"],
  maxDemoFileSizeMb: 25,
  formatsLabel: "PDF, PNG, JPEG/JPG, TIFF",
} as const;

export const PROCESSING_MODES: { value: ExtractionMode; description: string }[] = [
  { value: "Automatic", description: "Choose the best feature set from the document profile." },
  { value: "Text Detection", description: "Detect printed and handwritten lines and words." },
  { value: "Forms", description: "Extract related keys and values from forms." },
  { value: "Tables", description: "Recover rows, columns, cells, and table structure." },
  { value: "Queries", description: "Ask targeted natural-language questions." },
  { value: "Signatures", description: "Detect signature presence and location, not identity." },
  { value: "Layout", description: "Identify titles, headers, paragraphs, and layout elements." },
  { value: "Invoice / Receipt", description: "Invoice and receipt fields modeled on AnalyzeExpense." },
];

export function confidenceLevel(value: number, high = 90, medium = 80) {
  return value >= high ? "high" : value >= medium ? "medium" : "low";
}

