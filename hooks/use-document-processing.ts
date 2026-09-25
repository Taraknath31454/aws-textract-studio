"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProcessDocumentRequest, ProcessedDocument } from "@/lib/api/documents";
import { documentWorkflow } from "@/lib/api/document-workflow";
import { toApiError } from "@/lib/api/client";
import type { ApiError } from "@/lib/contracts/api";
import type { DocumentStatus, ProcessingStage } from "@/lib/contracts/document";

interface ProcessingState {
  status: DocumentStatus;
  stage?: ProcessingStage;
  progress: number;
  message: string;
  error: ApiError | null;
}

const initialState: ProcessingState = { status: "IDLE", progress: 0, message: "Ready to process.", error: null };

export function useDocumentProcessing() {
  const [state, setState] = useState<ProcessingState>(initialState);
  const controllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<ProcessDocumentRequest | null>(null);
  const lastDocumentIdRef = useRef<string | null>(null);

  const start = useCallback(async (request: ProcessDocumentRequest): Promise<ProcessedDocument | null> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    lastRequestRef.current = request;
    setState(initialState);

    try {
      const result = await documentWorkflow.processDocument(request, {
        signal: controller.signal,
        onUpdate: (update) => {
          lastDocumentIdRef.current = update.documentId;
          setState({ status: update.status, stage: update.stage, progress: update.progress, message: update.message, error: null });
        },
      });
      return result;
    } catch (error) {
      if (controller.signal.aborted) return null;
      const apiError = toApiError(error);
      setState((current) => ({ ...current, status: "FAILED", message: apiError.message, error: apiError }));
      return null;
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, []);

  const retry = useCallback(() => lastRequestRef.current ? start({ ...lastRequestRef.current, retryDocumentId: lastDocumentIdRef.current ?? undefined, shouldFail: false }) : Promise.resolve(null), [start]);
  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState(initialState);
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    ...state,
    isProcessing: state.status === "UPLOADING" || state.status === "PROCESSING",
    isComplete: state.status === "COMPLETED",
    isFailed: state.status === "FAILED",
    start,
    retry,
    reset,
  };
}
