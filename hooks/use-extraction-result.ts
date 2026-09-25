"use client";

import { useCallback, useEffect, useState } from "react";
import { toApiError } from "@/lib/api/client";
import { documentApi } from "@/lib/api/documents";
import type { ApiError } from "@/lib/contracts/api";
import type { ExtractionResult } from "@/lib/contracts/extraction";

export function useExtractionResult(documentId: string, enabled = true) {
  const [data, setData] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await documentApi.getExtractionResult(documentId, controller.signal);
        if (!response.data) throw new Error("No extraction result is available for this document.");
        setData(response.data);
      } catch (loadError) {
        if (!controller.signal.aborted) setError(toApiError(loadError));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [documentId, enabled, requestVersion]);

  const waitingForFirstResult = enabled && !data && !error;
  return { data, error, isLoading: isLoading || waitingForFirstResult, isError: Boolean(error), retry };
}
