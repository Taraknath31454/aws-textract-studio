import type { ExtractionProfile, ReviewItem } from "@/lib/types";

export const mockReviews: ReviewItem[] = [
  { id: "review-1", documentId: "demo-001", documentName: "Acme_Invoice_1042.pdf", field: "PO Number", machineValue: "PO-7482O", confidence: 78.4, page: 1, reason: "Below 85% confidence threshold", status: "Pending", audit: [{ id: "a1", timestamp: "09:42", action: "Extracted", detail: "Textract extracted PO-7482O", actor: "Textract" }, { id: "a2", timestamp: "09:44", action: "Sent to review", detail: "Confidence 78.4% was below threshold", actor: "System" }] },
  { id: "review-2", documentId: "demo-001", documentName: "Acme_Invoice_1042.pdf", field: "Tax ID", machineValue: "29ABCDE1234F1Z5", confidence: 82.4, page: 1, reason: "Ambiguous character detected", status: "Pending", audit: [{ id: "a3", timestamp: "09:42", action: "Extracted", detail: "Textract extracted 29ABCDE1234F1Z5", actor: "Textract" }, { id: "a4", timestamp: "09:44", action: "Sent to review", detail: "Possible character ambiguity", actor: "System" }] },
  { id: "review-3", documentId: "demo-004", documentName: "Travel_Receipt.jpg", field: "Total", machineValue: "₹1,84O.00", reviewedValue: "₹1,840.00", confidence: 72.1, page: 1, reason: "Low scan quality", status: "Edited", updatedAt: "Yesterday, 11:14", audit: [{ id: "a5", timestamp: "11:08", action: "Extracted", detail: "Textract extracted ₹1,84O.00", actor: "Textract" }, { id: "a6", timestamp: "11:14", action: "Corrected", detail: "₹1,84O.00 → ₹1,840.00", actor: "Reviewer" }] },
];

export const mockProfiles: ExtractionProfile[] = [
  { id: "profile-invoice", name: "Invoice Intelligence", features: ["Invoice / Receipt", "Tables", "Queries"], confidenceThreshold: 85, autoReview: true, queries: [{ id: "iq1", question: "What is the invoice number?", alias: "INVOICE_NUMBER", pages: "1" }, { id: "iq2", question: "What is the total amount?", alias: "TOTAL_AMOUNT", pages: "*" }] },
  { id: "profile-contract", name: "Contract Review", features: ["Queries", "Signatures", "Layout"], confidenceThreshold: 88, autoReview: true, queries: [{ id: "cq1", question: "What is the effective date?", alias: "EFFECTIVE_DATE", pages: "*" }] },
  { id: "profile-application", name: "Application Processing", features: ["Forms", "Signatures"], confidenceThreshold: 85, autoReview: true, queries: [] },
  { id: "profile-general", name: "General OCR", features: ["Text Detection", "Layout"], confidenceThreshold: 80, autoReview: false, queries: [] },
];

