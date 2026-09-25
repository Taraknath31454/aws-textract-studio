import type { ExtractionResult } from "@/lib/contracts/extraction";

export const mockInvoiceExtraction: ExtractionResult = {
  documentId: "demo-001",
  documentType: "Invoice",
  pages: 2,
  processingTime: "2.8 seconds",
  overallConfidence: 94.8,
  createdAt: "2026-09-17T04:14:48.000Z",
  fullText: `ACME SYSTEMS\nINVOICE\nInvoice Number: INV-2026-1042\nInvoice Date: 02 Sep 2026\nBill To: Meridian Retail Pvt. Ltd.\n\nCloud Infrastructure Setup  1  ₹32,000.00\nTechnical Support          4  ₹2,000.00\nSubtotal: ₹40,000.00\nGST (6.45%): ₹2,580.00\nTotal Amount: ₹42,580.00\n\nTax ID: 29ABCDE1234F1Z5\nPayment due within 15 days.`,
  fields: [
    { id: "invoice-number", key: "Invoice Number", value: "INV-2026-1042", confidence: 98.7, boundingBox: { left: 62, top: 20, width: 25, height: 4, page: 1 }, reviewStatus: "Approved" },
    { id: "invoice-date", key: "Invoice Date", value: "02 Sep 2026", confidence: 97.9, boundingBox: { left: 64, top: 26, width: 22, height: 4, page: 1 }, reviewStatus: "Approved" },
    { id: "vendor", key: "Vendor", value: "Acme Systems", confidence: 96.4, boundingBox: { left: 9, top: 10, width: 31, height: 7, page: 1 }, reviewStatus: "Approved" },
    { id: "customer", key: "Customer", value: "Meridian Retail Pvt. Ltd.", confidence: 91.6, boundingBox: { left: 9, top: 31, width: 35, height: 4, page: 1 }, sensitive: true, reviewStatus: "Approved" },
    { id: "total", key: "Total Amount", value: "₹42,580.00", confidence: 99.1, boundingBox: { left: 67, top: 69, width: 21, height: 5, page: 1 }, sensitive: true, reviewStatus: "Approved" },
    { id: "tax-id", key: "Tax ID", value: "29ABCDE1234F1Z5", confidence: 82.4, boundingBox: { left: 9, top: 80, width: 29, height: 4, page: 1 }, sensitive: true, reviewStatus: "Pending" },
    { id: "po-number", key: "PO Number", value: "PO-7482O", confidence: 78.4, boundingBox: { left: 64, top: 32, width: 19, height: 4, page: 1 }, reviewStatus: "Pending" },
  ],
  tables: [{ id: "line-items", title: "Invoice line items", headers: ["Item", "Quantity", "Rate", "Amount"], rows: [["Cloud Infrastructure Setup", "1", "₹32,000.00", "₹32,000.00"], ["Technical Support", "4", "₹2,000.00", "₹8,000.00"], ["GST", "—", "6.45%", "₹2,580.00"]], confidence: 96.1 }],
  queries: [
    { id: "q1", question: "What is the invoice number?", alias: "INVOICE_NUMBER", pages: "1", answer: "INV-2026-1042", confidence: 98.7, boundingBox: { left: 62, top: 20, width: 25, height: 4, page: 1 } },
    { id: "q2", question: "What is the total amount?", alias: "TOTAL_AMOUNT", pages: "*", answer: "₹42,580.00", confidence: 99.1, boundingBox: { left: 67, top: 69, width: 21, height: 5, page: 1 } },
    { id: "q3", question: "Who is the customer?", alias: "CUSTOMER", pages: "1", answer: "Meridian Retail Pvt. Ltd.", confidence: 91.6, boundingBox: { left: 9, top: 31, width: 35, height: 4, page: 1 } },
  ],
  signatures: [{ id: "sig-1", page: 2, confidence: 93.2, boundingBox: { left: 60, top: 73, width: 24, height: 10, page: 2 }, status: "Approved" }],
};

