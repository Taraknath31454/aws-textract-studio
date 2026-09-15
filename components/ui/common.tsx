"use client";

import { AlertTriangle, Check, CheckCircle2, ChevronDown, Circle, Clock3, Copy, Download, LoaderCircle, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { confidenceLevel } from "@/lib/constants";
import { cn, downloadFile } from "@/lib/utils/format";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return <header className="page-header reveal"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</header>;
}
export function Card({ children, className, interactive = false, id }: { children: React.ReactNode; className?: string; interactive?: boolean; id?: string }) { return <section id={id} className={cn("card", interactive && "card-interactive", className)}>{children}</section>; }
export function Confidence({ value, label = true }: { value: number; label?: boolean }) { const level = confidenceLevel(value); return <div className={cn("confidence", `confidence-${level}`)} title={`${value.toFixed(1)}% confidence`}><span className="confidence-bar"><i style={{ width: `${value}%` }} /></span>{label && <strong>{value.toFixed(1)}%</strong>}</div>; }
export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase().replaceAll(" ", "-");
  const active = ["uploading", "scanning", "analyzing", "extracting", "processing"].includes(key);
  const Icon = active ? LoaderCircle : ["completed", "approved", "verified"].includes(key) ? CheckCircle2 : ["failed", "flagged", "rejected"].includes(key) ? XCircle : ["needs-review", "review-required"].includes(key) ? AlertTriangle : key === "pending" ? Clock3 : Circle;
  return <span className={cn("status", `status-${key}`, active && "status-active")}><Icon className="status-icon" aria-hidden="true" />{status}</span>;
}
export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) { return <div className="empty-state"><span>{icon}</span><h3>{title}</h3><p>{description}</p>{action}</div>; }
export function SearchBox({ value, onChange, placeholder = "Search" }: { value: string; onChange: (value: string) => void; placeholder?: string }) { return <label className="search-box"><Search size={16} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>; }
export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) { const [copied, setCopied] = useState(false); return <button className="btn btn-ghost btn-sm" onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : label}</button>; }
export function DownloadButton({ filename, content, type, label = "Download" }: { filename: string; content: string; type?: string; label?: string }) { return <button className="btn btn-ghost btn-sm" onClick={() => downloadFile(filename, content, type)}><Download size={15} />{label}</button>; }
export function Collapsible({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) { const [open, setOpen] = useState(defaultOpen); return <div className={cn("collapsible", open && "open")}><button onClick={() => setOpen(!open)} aria-expanded={open}><span>{title}</span><ChevronDown size={17} /></button>{open && <div className="collapsible-content">{children}</div>}</div>; }
export function Segmented<T extends string>({ value, options, onChange, ariaLabel }: { value: T; options: T[]; onChange: (value: T) => void; ariaLabel: string }) { return <div className="segmented" role="group" aria-label={ariaLabel}>{options.map((option) => <button key={option} className={value === option ? "active" : ""} onClick={() => onChange(option)}>{option}</button>)}</div>; }
