// Compatibility barrel. New feature code should use lib/mocks or the service layer.
export { mockDocuments as demoDocuments } from "@/lib/mocks/documents";
export { mockInvoiceExtraction as invoiceResult } from "@/lib/mocks/extraction";
export { mockProfiles as defaultProfiles, mockReviews as initialReviews } from "@/lib/mocks/workspace";

