"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { defaultProfiles, demoDocuments, initialReviews } from "@/lib/mock/data";
import type { DocumentRecord, ExtractionProfile, ReviewItem, ReviewStatus, UserSettings } from "@/lib/types";

const defaultSettings: UserSettings = { appearance: "dark", confidenceThreshold: 85, autoReview: true, privacyMode: false, exportFormat: "json" };
interface Toast { id: number; title: string; description?: string }
interface AppContextValue {
  settings: UserSettings;
  updateSettings: (value: Partial<UserSettings>) => void;
  reviews: ReviewItem[];
  updateReview: (id: string, status: ReviewStatus, value?: string) => void;
  documents: DocumentRecord[];
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
  const [reviews, setReviews] = useState(initialReviews);
  const [documents, setDocuments] = useState(demoDocuments);
  const [profiles, setProfiles] = useState(defaultProfiles);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSettings(readStored("textract-studio:settings", defaultSettings));
      setReviews(readStored("textract-studio:reviews", initialReviews));
      setDocuments(readStored("textract-studio:documents", demoDocuments));
      setProfiles(readStored("textract-studio:profiles", defaultProfiles));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

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

  const value = useMemo(() => ({ settings, updateSettings, reviews, updateReview, documents, removeDocument, addDocument, profiles, saveProfile, toast }), [settings, updateSettings, reviews, updateReview, documents, removeDocument, addDocument, profiles, saveProfile, toast]);
  return <AppContext.Provider value={value}>{children}<div className="toast-stack" aria-live="polite">{toasts.map((item) => <div className="toast" key={item.id}><CheckCircle2 size={18} /><div><strong>{item.title}</strong>{item.description && <span>{item.description}</span>}</div><button onClick={() => setToasts((items) => items.filter((toastItem) => toastItem.id !== item.id))} aria-label="Dismiss notification"><X size={15} /></button></div>)}</div></AppContext.Provider>;
}

export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used inside AppProvider"); return context; }
export function DemoDisclaimer({ compact = false }: { compact?: boolean }) { return <div className={compact ? "demo-note compact" : "demo-note"}><Info size={15} />Demo simulation — AWS services are not connected yet.</div>; }
