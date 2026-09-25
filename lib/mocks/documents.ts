import type { DocumentRecord } from "@/lib/contracts/document";

export const mockDocuments: DocumentRecord[] = [
  { id: "demo-001", fileName: "Acme_Invoice_1042.pdf", fileType: "application/pdf", fileSize: 1_887_437, documentType: "Invoice", pageCount: 2, extractionMode: "Invoice / Receipt", confidence: 94.8, status: "COMPLETED", reviewRequired: true, createdAt: "2026-09-17T04:12:00.000Z", updatedAt: "2026-09-17T04:14:48.000Z", tags: ["invoice", "finance"] },
  { id: "demo-002", fileName: "Vendor_Application.pdf", fileType: "application/pdf", fileSize: 3_355_443, documentType: "Application", pageCount: 4, extractionMode: "Forms", confidence: 91.2, status: "COMPLETED", reviewRequired: false, createdAt: "2026-09-17T02:46:00.000Z", updatedAt: "2026-09-17T02:49:11.000Z", tags: ["application"] },
  { id: "demo-003", fileName: "Cloud_Services_Agreement.pdf", fileType: "application/pdf", fileSize: 7_025_459, documentType: "Contract", pageCount: 12, extractionMode: "Queries", confidence: 88.6, status: "COMPLETED", reviewRequired: false, createdAt: "2026-09-16T11:01:00.000Z", updatedAt: "2026-09-16T11:05:21.000Z", tags: ["contract", "legal"] },
  { id: "demo-004", fileName: "Travel_Receipt.jpg", fileType: "image/jpeg", fileSize: 860_160, documentType: "Invoice", pageCount: 1, extractionMode: "Automatic", confidence: 76.8, status: "COMPLETED", reviewRequired: true, createdAt: "2026-09-16T05:38:00.000Z", updatedAt: "2026-09-16T05:39:42.000Z", tags: ["receipt"] },
  { id: "demo-005", fileName: "Quarterly_Memo.pdf", fileType: "application/pdf", fileSize: 2_202_010, documentType: "Business Document", pageCount: 3, extractionMode: "Layout", confidence: 98.4, status: "COMPLETED", reviewRequired: false, createdAt: "2026-08-30T08:50:00.000Z", updatedAt: "2026-08-30T08:52:10.000Z", tags: ["memo"] },
  { id: "demo-006", fileName: "Scanned_Form.tiff", fileType: "image/tiff", fileSize: 9_856_614, documentType: "Application", pageCount: 2, extractionMode: "Forms", confidence: 61.5, status: "FAILED", processingStage: "SCANNING", reviewRequired: false, createdAt: "2026-08-29T04:34:00.000Z", updatedAt: "2026-08-29T04:34:52.000Z", tags: ["scan"] },
];

