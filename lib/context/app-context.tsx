"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { documentApi } from "@/lib/api/documents";
import { toApiError } from "@/lib/api/client";
import { mockProfiles, mockReviews } from "@/lib/mocks";
import type { DocumentRecord, ExtractionProfile, ReviewItem, ReviewStatus, UserSettings } from "@/lib/types";
import type { ApiError } from "@/lib/contracts/api";
import { migrateDocumentRecords } from "@/lib/utils/documents";

const defaultSettings: UserSettings = { appearance: "dark", confidenceThreshold: 85, autoReview: true, privacyMode: false, exportFormat: "json" };
interface Toast { id: number; title: string; description?: string }
interface AppContextValue {
  settings: UserSettings;
  updateSettings: (value: Partial<UserSettings>) => void;
  reviews: ReviewItem[];
  updateReview: (id: string, status: ReviewStatus, value?: string) => void;
  documents: DocumentRecord[];
  documentsLoading: boolean;
  documentsError: ApiError | null;
  refreshDocuments: () => Promise<void>;
  removeDocument: (id: string) => void;
  addDocument: (document: DocumentRecord) => void;
  profiles: ExtractionProfile[];
  saveProfile: (profile: ExtractionProfile) => void;
  toast: (title: string, description?: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function readStored<T>(key: string, fallback: T): T {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [reviews, setReviews] = useState(mockReviews);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState<ApiError | null>(null);
  const [profiles, setProfiles] = useState(mockProfiles);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ready, setReady] = useState(false);

  const refreshDocuments = useCallback(async () => {
    setDocumentsLoading(true);
    setDocumentsError(null);
    try {
      const response = await documentApi.listDocuments();
      const storedJson = window.localStorage.getItem("textract-studio:documents");
      const stored = storedJson === null ? null : readStored<unknown>("textract-studio:documents", null);
      setDocuments(stored === null ? response.data : migrateDocumentRecords(stored));
    } catch (error) {
      setDocumentsError(toApiError(error));
    } finally {
      setDocumentsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSettings(readStored("textract-studio:settings", defaultSettings));
      setReviews(readStored("textract-studio:reviews", mockReviews));
      setProfiles(readStored("textract-studio:profiles", mockProfiles));
      void refreshDocuments();
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshDocuments]);

  useEffect(() => {
    const root = document.documentElement;
    const dark = settings.appearance === "dark" || (settings.appearance === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "dark" : "light";
  }, [settings.appearance]);

  const persist = useCallback(<T,>(key: string, value: T) => { if (ready) window.localStorage.setItem(key, JSON.stringify(value)); }, [ready]);
  const toast = useCallback((title: string, description?: string) => {
    const id = Date.now(); setToasts((items) => [...items, { id, title, description }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3600);
  }, []);
  const updateSettings = useCallback((value: Partial<UserSettings>) => setSettings((current) => { const next = { ...current, ...value }; persist("textract-studio:settings", next); return next; }), [persist]);
  const updateReview = useCallback((id: string, status: ReviewStatus, value?: string) => setReviews((current) => {
    const now = new Date(); const stamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const next = current.map((item) => item.id === id ? { ...item, status, reviewedValue: value ?? item.reviewedValue, updatedAt: "Just now", audit: [...item.audit, { id: `audit-${Date.now()}`, timestamp: stamp, action: status === "Edited" ? "Corrected" : status, detail: value ? `${item.machineValue} → ${value}` : `${item.field} marked ${status.toLowerCase()}`, actor: "Reviewer" as const }] } : item);
    persist("textract-studio:reviews", next); return next;
  }), [persist]);
  const removeDocument = useCallback((id: string) => setDocuments((current) => { const next = current.filter((item) => item.id !== id); persist("textract-studio:documents", next); return next; }), [persist]);
  const addDocument = useCallback((document: DocumentRecord) => setDocuments((current) => { const next = [document, ...current.filter((item) => item.id !== document.id)]; persist("textract-studio:documents", next); return next; }), [persist]);
  const saveProfile = useCallback((profile: ExtractionProfile) => setProfiles((current) => { const next = [profile, ...current.filter((item) => item.id !== profile.id)]; persist("textract-studio:profiles", next); return next; }), [persist]);

  const value = useMemo(() => ({ settings, updateSettings, reviews, updateReview, documents, documentsLoading, documentsError, refreshDocuments, removeDocument, addDocument, profiles, saveProfile, toast }), [settings, updateSettings, reviews, updateReview, documents, documentsLoading, documentsError, refreshDocuments, removeDocument, addDocument, profiles, saveProfile, toast]);
  return <AppContext.Provider value={value}>{children}<div className="toast-stack" aria-live="polite">{toasts.map((item) => <div className="toast" key={item.id}><CheckCircle2 size={18} /><div><strong>{item.title}</strong>{item.description && <span>{item.description}</span>}</div><button onClick={() => setToasts((items) => items.filter((toastItem) => toastItem.id !== item.id))} aria-label="Dismiss notification"><X size={15} /></button></div>)}</div></AppContext.Provider>;
}

export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used inside AppProvider"); return context; }
export function DemoDisclaimer({ compact = false }: { compact?: boolean }) { return <div className={compact ? "demo-note compact" : "demo-note"}><Info size={15} />Demo simulation — AWS services are not connected yet.</div>; }
