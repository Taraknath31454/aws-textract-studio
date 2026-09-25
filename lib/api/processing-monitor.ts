import { ApiServiceError } from "@/lib/api/client";
import type { DocumentApi, ProcessingStatusResult } from "@/lib/api/documents";

export interface ProcessingMonitorOptions {
  signal?: AbortSignal;
  intervalMs?: number;
  maxAttempts?: number;
  onStatus?: (status: ProcessingStatusResult) => void;
}

function wait(milliseconds: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("The request was cancelled.", "AbortError"));
      return;
    }
    const finish = () => {
      signal?.removeEventListener("abort", abort);
      resolve();
    };
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("The request was cancelled.", "AbortError"));
    };
    const timer = setTimeout(finish, milliseconds);
    signal?.addEventListener("abort", abort, { once: true });
  });
}

export async function monitorProcessing(api: DocumentApi, documentId: string, options: ProcessingMonitorOptions = {}) {
  const { signal, intervalMs = 240, maxAttempts = 60, onStatus } = options;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await api.getProcessingStatus(documentId, signal);
    onStatus?.(response.data);
    if (response.data.status === "COMPLETED" || response.data.status === "FAILED") return response.data;
    await wait(intervalMs, signal);
  }
  throw new ApiServiceError({ code: "PROCESSING_TIMEOUT", message: "Document processing did not finish within the monitoring window.", status: 408 });
}

