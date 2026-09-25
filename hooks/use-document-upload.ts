"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DOCUMENT_RULES } from "@/lib/constants";

export function useDocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  const clearFile = useCallback(() => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setPreviewUrl(null);
    setFile(null);
    setError(null);
  }, []);

  const selectFile = useCallback((selected?: File) => {
    if (!selected) return false;
    const extension = `.${selected.name.split(".").pop()?.toLowerCase()}`;
    if (!DOCUMENT_RULES.acceptedExtensions.includes(extension as (typeof DOCUMENT_RULES.acceptedExtensions)[number])) {
      setError(`Unsupported file. Choose ${DOCUMENT_RULES.formatsLabel}.`);
      return false;
    }
    if (selected.size > DOCUMENT_RULES.maxDemoFileSizeMb * 1024 * 1024) {
      setError(`File is larger than the ${DOCUMENT_RULES.maxDemoFileSizeMb} MB demo limit.`);
      return false;
    }

    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const nextPreview = selected.type.startsWith("image/") ? URL.createObjectURL(selected) : null;
    previewRef.current = nextPreview;
    setPreviewUrl(nextPreview);
    setFile(selected);
    setError(null);
    return true;
  }, []);

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  return { file, previewUrl, error, selectFile, clearFile, setError };
}

