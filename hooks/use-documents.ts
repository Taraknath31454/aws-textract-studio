"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/context/app-context";

export function useDocuments() {
  const { documents, documentsError, documentsLoading, addDocument, removeDocument, refreshDocuments } = useApp();

  return useMemo(() => ({
    documents,
    isLoading: documentsLoading,
    isError: Boolean(documentsError),
    error: documentsError,
    addDocument,
    removeDocument,
    refresh: refreshDocuments,
    getDocument: (id: string) => documents.find((document) => document.id === id),
  }), [addDocument, documents, documentsError, documentsLoading, refreshDocuments, removeDocument]);
}

