import type { DocumentRecord, ExtractionProfile, ExtractionResult, ReviewItem } from "@/lib/types";

export const demoDocuments: DocumentRecord[] = [
  { id: "demo-001", name: "Acme_Invoice_1042.pdf", type: "Invoice", pages: 2, mode: "Invoice / Receipt", confidence: 94.8, status: "Needs Review", uploadedAt: "Today, 09:42", size: "1.8 MB", tags: ["invoice", "finance"] },
  { id: "demo-002", name: "Vendor_Application.pdf", type: "Application", pages: 4, mode: "Forms", confidence: 91.2, status: "Completed", uploadedAt: "Today, 08:16", size: "3.2 MB", tags: ["application"] },
  { id: "demo-003", name: "Cloud_Services_Agreement.pdf", type: "Contract", pages: 12, mode: "Queries", confidence: 88.6, status: "Completed", uploadedAt: "Yesterday, 16:31", size: "6.7 MB", tags: ["contract", "legal"] },
  { id: "demo-004", name: "Travel_Receipt.jpg", type: "Invoice", pages: 1, mode: "Automatic", confidence: 76.8, status: "Needs Review", uploadedAt: "Yesterday, 11:08", size: "840 KB", tags: ["receipt"] },
  { id: "demo-005", name: "Quarterly_Memo.pdf", type: "Business Document", pages: 3, mode: "Layout", confidence: 98.4, status: "Completed", uploadedAt: "30 Aug, 14:20", size: "2.1 MB", tags: ["memo"] },
  { id: "demo-006", name: "Scanned_Form.tiff", type: "Application", pages: 2, mode: "Forms", confidence: 61.5, status: "Failed", uploadedAt: "29 Aug, 10:04", size: "9.4 MB", tags: ["scan"] },
];

export const invoiceResult: ExtractionResult = {
  documentId: "demo-001",
  documentType: "Invoice",
  pages: 2,
  processingTime: "2.8 seconds",
  overallConfidence: 94.8,
  fullText: `ACME SYSTEMS\nINVOICE\nInvoice Number: INV-2026-1042\nInvoice Date: 02 Sep 2026\nBill To: Meridian Retail Pvt. Ltd.\n\nCloud Infrastructure Setup  1  ₹32,000.00\nTechnical Support          4  ₹2,000.00\nSubtotal: ₹40,000.00\nGST (6.45%): ₹2,580.00\nTotal Amount: ₹42,580.00\n\nTax ID: 29ABCDE1234F1Z5\nPayment due within 15 days.`,
  fields: [
    { id: "invoice-number", label: "Invoice Number", value: "INV-2026-1042", confidence: 98.7, boundingBox: { left: 62, top: 20, width: 25, height: 4, page: 1 }, reviewStatus: "Approved" },
    { id: "invoice-date", label: "Invoice Date", value: "02 Sep 2026", confidence: 97.9, boundingBox: { left: 64, top: 26, width: 22, height: 4, page: 1 }, reviewStatus: "Approved" },
    { id: "vendor", label: "Vendor", value: "Acme Systems", confidence: 96.4, boundingBox: { left: 9, top: 10, width: 31, height: 7, page: 1 }, reviewStatus: "Approved" },
    { id: "customer", label: "Customer", value: "Meridian Retail Pvt. Ltd.", confidence: 91.6, boundingBox: { left: 9, top: 31, width: 35, height: 4, page: 1 }, sensitive: true, reviewStatus: "Approved" },
    { id: "total", label: "Total Amount", value: "₹42,580.00", confidence: 99.1, boundingBox: { left: 67, top: 69, width: 21, height: 5, page: 1 }, sensitive: true, reviewStatus: "Approved" },
    { id: "tax-id", label: "Tax ID", value: "29ABCDE1234F1Z5", confidence: 82.4, boundingBox: { left: 9, top: 80, width: 29, height: 4, page: 1 }, sensitive: true, reviewStatus: "Pending" },
    { id: "po-number", label: "PO Number", value: "PO-7482O", confidence: 78.4, boundingBox: { left: 64, top: 32, width: 19, height: 4, page: 1 }, reviewStatus: "Pending" },
  ],
  tables: [{ id: "line-items", title: "Invoice line items", headers: ["Item", "Quantity", "Rate", "Amount"], rows: [["Cloud Infrastructure Setup", "1", "₹32,000.00", "₹32,000.00"], ["Technical Support", "4", "₹2,000.00", "₹8,000.00"], ["GST", "—", "6.45%", "₹2,580.00"]], confidence: 96.1 }],
  queries: [
    { id: "q1", question: "What is the invoice number?", alias: "INVOICE_NUMBER", pages: "1", answer: "INV-2026-1042", confidence: 98.7, boundingBox: { left: 62, top: 20, width: 25, height: 4, page: 1 } },
    { id: "q2", question: "What is the total amount?", alias: "TOTAL_AMOUNT", pages: "*", answer: "₹42,580.00", confidence: 99.1, boundingBox: { left: 67, top: 69, width: 21, height: 5, page: 1 } },
    { id: "q3", question: "Who is the customer?", alias: "CUSTOMER", pages: "1", answer: "Meridian Retail Pvt. Ltd.", confidence: 91.6, boundingBox: { left: 9, top: 31, width: 35, height: 4, page: 1 } },
  ],
  signatures: [{ id: "sig-1", page: 2, confidence: 93.2, boundingBox: { left: 60, top: 73, width: 24, height: 10, page: 2 }, status: "Approved" }],
};

export const initialReviews: ReviewItem[] = [
  { id: "review-1", documentId: "demo-001", documentName: "Acme_Invoice_1042.pdf", field: "PO Number", machineValue: "PO-7482O", confidence: 78.4, page: 1, reason: "Below 85% confidence threshold", status: "Pending", audit: [
    { id: "a1", timestamp: "09:42", action: "Extracted", detail: "Textract extracted PO-7482O", actor: "Textract" },
    { id: "a2", timestamp: "09:44", action: "Sent to review", detail: "Confidence 78.4% was below threshold", actor: "System" },
  ] },
  { id: "review-2", documentId: "demo-001", documentName: "Acme_Invoice_1042.pdf", field: "Tax ID", machineValue: "29ABCDE1234F1Z5", confidence: 82.4, page: 1, reason: "Ambiguous character detected", status: "Pending", audit: [
    { id: "a3", timestamp: "09:42", action: "Extracted", detail: "Textract extracted 29ABCDE1234F1Z5", actor: "Textract" },
    { id: "a4", timestamp: "09:44", action: "Sent to review", detail: "Possible character ambiguity", actor: "System" },
  ] },
  { id: "review-3", documentId: "demo-004", documentName: "Travel_Receipt.jpg", field: "Total", machineValue: "₹1,84O.00", reviewedValue: "₹1,840.00", confidence: 72.1, page: 1, reason: "Low scan quality", status: "Edited", updatedAt: "Yesterday, 11:14", audit: [
    { id: "a5", timestamp: "11:08", action: "Extracted", detail: "Textract extracted ₹1,84O.00", actor: "Textract" },
    { id: "a6", timestamp: "11:14", action: "Corrected", detail: "₹1,84O.00 → ₹1,840.00", actor: "Reviewer" },
  ] },
];

export const defaultProfiles: ExtractionProfile[] = [
  { id: "profile-invoice", name: "Invoice Intelligence", features: ["Invoice / Receipt", "Tables", "Queries"], confidenceThreshold: 85, autoReview: true, queries: [
    { id: "iq1", question: "What is the invoice number?", alias: "INVOICE_NUMBER", pages: "1" },
    { id: "iq2", question: "What is the total amount?", alias: "TOTAL_AMOUNT", pages: "*" },
  ] },
  { id: "profile-contract", name: "Contract Review", features: ["Queries", "Signatures", "Layout"], confidenceThreshold: 88, autoReview: true, queries: [{ id: "cq1", question: "What is the effective date?", alias: "EFFECTIVE_DATE", pages: "*" }] },
  { id: "profile-application", name: "Application Processing", features: ["Forms", "Signatures"], confidenceThreshold: 85, autoReview: true, queries: [] },
  { id: "profile-general", name: "General OCR", features: ["Text Detection", "Layout"], confidenceThreshold: 80, autoReview: false, queries: [] },
];

