"use client";
/* eslint-disable @next/next/no-img-element -- object URLs selected in-browser cannot use the Next image optimizer */

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Check, CheckCircle2, ChevronRight, Circle, CloudUpload, FileText, HelpCircle, Info, Layers3, LoaderCircle, Lock, Plus, ScanLine, ShieldCheck, Sparkles, Trash2, UploadCloud, WandSparkles, Zap } from "lucide-react";
import { Card, Collapsible } from "@/components/ui/common";
import { PipelineIndicator } from "@/components/ui/pipeline-indicator";
import { DemoDisclaimer, useApp } from "@/lib/context/app-context";
import { DOCUMENT_RULES, PROCESSING_MODES } from "@/lib/constants";
import { documentProcessingService } from "@/lib/services/document-processing";
import type { ExtractionMode, TextractQuery } from "@/lib/types";
import { cn } from "@/lib/utils/format";

const stages = [
  { label: "Upload Received", sub: "Browser", icon: UploadCloud, at: 12 }, { label: "Secure Storage", sub: "Amazon S3", icon: Box, at: 29 }, { label: "Processing Trigger", sub: "AWS Lambda", icon: Zap, at: 48 }, { label: "Document Intelligence", sub: "Amazon Textract", icon: ScanLine, at: 68 }, { label: "Result Normalization", sub: "Structured output", icon: Layers3, at: 84 }, { label: "Ready for Review", sub: "Workspace", icon: CheckCircle2, at: 100 },
];
const sampleQueries: TextractQuery[] = [{ id: "q1", question: "What is the invoice number?", alias: "INVOICE_NUMBER", pages: "1" }];

export function UploadWorkspace() {
  const router = useRouter(); const inputRef = useRef<HTMLInputElement>(null); const { toast, addDocument } = useApp();
  const [file, setFile] = useState<File | null>(null); const [preview, setPreview] = useState<string | null>(null); const [mode, setMode] = useState<ExtractionMode>("Automatic"); const [profile, setProfile] = useState("General Document"); const [queries, setQueries] = useState<TextractQuery[]>(sampleQueries); const [threshold, setThreshold] = useState(85); const [autoReview, setAutoReview] = useState(true); const [signatures, setSignatures] = useState(true); const [layout, setLayout] = useState(true); const [preserveRaw, setPreserveRaw] = useState(false); const [privacy, setPrivacy] = useState(false); const [dragging, setDragging] = useState(false); const [error, setError] = useState(""); const [processing, setProcessing] = useState(false); const [progress, setProgress] = useState(0);

  const selectFile = (selected?: File) => {
    if (!selected) return; setError("");
    const extension = `.${selected.name.split(".").pop()?.toLowerCase()}`;
    if (!DOCUMENT_RULES.acceptedExtensions.includes(extension as never)) { setError(`Unsupported file. Choose ${DOCUMENT_RULES.formatsLabel}.`); return; }
    if (selected.size > DOCUMENT_RULES.maxDemoFileSizeMb * 1024 * 1024) { setError(`File is larger than the ${DOCUMENT_RULES.maxDemoFileSizeMb} MB demo limit.`); return; }
    if (preview) URL.revokeObjectURL(preview); setFile(selected); setPreview(selected.type.startsWith("image/") ? URL.createObjectURL(selected) : null); toast("Upload added", `${selected.name} is ready for preflight.`);
  };
  const addQuery = () => setQueries((items) => [...items, { id: `q-${Date.now()}`, question: "", alias: "", pages: "*" }]);
  const updateQuery = (id: string, key: keyof TextractQuery, value: string) => setQueries((items) => items.map((item) => item.id === id ? { ...item, [key]: value } : item));
  const runProcessing = async (demo = false) => {
    if (!file && !demo) { setError("Choose a document or try the demo invoice first."); return; }
    setProcessing(true); setProgress(2); toast("Processing started", "Running the local AWS workflow simulation.");
    const id = await documentProcessingService.process({ file: file ?? undefined, demoDocumentId: demo ? "demo-001" : undefined, mode, profile, queries }, setProgress);
    if (file) addDocument({ id, name: file.name, type: profile.includes("Invoice") ? "Invoice" : "Business Document", pages: file.type === "application/pdf" ? 2 : 1, mode, confidence: 94.8, status: "Needs Review", uploadedAt: "Just now", size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, tags: ["local"] });
    toast("Processing finished", "The demo result is ready to review."); router.push(`/documents/${id}`);
  };

  if (processing) return <ProcessingPipeline progress={progress} />;
  return <div className="upload-layout">
    <div className="upload-main">
      <Card className="upload-card"><div className="section-title"><span className="number-badge">01</span><div><h2>Add a document</h2><p>Your file stays in this browser during the frontend demo.</p></div></div>
        {!file ? <div className={cn("dropzone", dragging && "dragging", error && "has-error")} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files[0]); }}><input ref={inputRef} type="file" accept={DOCUMENT_RULES.acceptedExtensions.join(",")} onChange={(event) => selectFile(event.target.files?.[0])} /><span className="drop-icon"><CloudUpload size={29} /></span><h3>Drop your document here</h3><p>or <button onClick={() => inputRef.current?.click()}>browse files</button> from your device</p><div className="format-chips">{["PDF","PNG","JPG","TIFF"].map((value) => <span key={value}>{value}</span>)}</div><small>Maximum {DOCUMENT_RULES.maxDemoFileSizeMb} MB in demo mode · Files never leave your browser</small></div> : <div className="selected-file"><div className="file-preview">{preview ? <img src={preview} alt="Selected document preview" /> : <FileText size={36} />}</div><div className="file-info"><span className="status status-completed"><i /> Ready</span><h3>{file.name}</h3><p>{(file.size / 1024 / 1024).toFixed(2)} MB · {file.name.split(".").pop()?.toUpperCase()} · {file.type === "application/pdf" ? "Page count available after backend analysis" : "1 image"}</p></div><button className="icon-btn" onClick={() => { setFile(null); setPreview(null); }} aria-label="Remove selected file"><Trash2 size={18} /></button></div>}
        {error && <div className="inline-error"><Info size={16} />{error}</div>}
        <button className="demo-document-link" onClick={() => void runProcessing(true)}><span><WandSparkles size={18} /></span><div><strong>Try Demo Document</strong><small>Process a realistic invoice instantly — no upload needed</small></div><ChevronRight size={18} /></button>
      </Card>

      <Card><div className="section-title"><span className="number-badge">02</span><div><h2>Choose processing mode</h2><p>Select the Textract capability that fits your document.</p></div></div><div className="mode-grid">{PROCESSING_MODES.map((item, index) => <button className={cn("mode-card", mode === item.value && "selected")} key={item.value} onClick={() => setMode(item.value)} title={item.description}><span>{index === 0 ? <Sparkles /> : index === 3 ? <ScanLine /> : <FileText />}</span><div><strong>{item.value}</strong><small>{item.description}</small></div>{item.value === "Automatic" && <em>RECOMMENDED</em>}{mode === item.value && <Check className="mode-check" size={15} />}</button>)}</div></Card>

      <Card><div className="section-title"><span className="number-badge">03</span><div><h2>Extraction profile</h2><p>Apply a reusable frontend preset for your workflow.</p></div></div><div className="profile-options">{["General Document","Invoice / Receipt","Application Form","Contract","Custom"].map((value) => <button className={profile === value ? "active" : ""} onClick={() => setProfile(value)} key={value}><span>{value === "Invoice / Receipt" ? <FileText /> : <Layers3 />}</span><strong>{value}</strong><small>{value === "General Document" ? "Balanced extraction" : value === "Invoice / Receipt" ? "Expense fields + tables" : `${value} preset`}</small>{profile === value && <Check size={15} />}</button>)}</div></Card>

      {(mode === "Queries" || profile === "Custom") && <Card><div className="card-heading"><div><h2>Query configuration</h2><p>Maps cleanly to a future Textract QueriesConfig.</p></div><span className="query-count">Queries used: {queries.length}</span></div><div className="query-builder">{queries.map((query, index) => <div className="query-row" key={query.id}><span>{index + 1}</span><label>Question<input value={query.question} placeholder="What is the document date?" onChange={(event) => updateQuery(query.id, "question", event.target.value)} /></label><label>Alias<input value={query.alias} placeholder="DOCUMENT_DATE" onChange={(event) => updateQuery(query.id, "alias", event.target.value)} /></label><label>Pages<input value={query.pages} placeholder="1, 1-3, or *" onChange={(event) => updateQuery(query.id, "pages", event.target.value)} /></label><button className="icon-btn" onClick={() => setQueries((items) => items.filter((item) => item.id !== query.id))} aria-label="Remove query"><Trash2 size={17} /></button></div>)}</div><button className="btn btn-secondary" onClick={addQuery}><Plus size={16} /> Add Query</button></Card>}

      <Collapsible title="Advanced settings"><div className="advanced-grid"><label className="range-setting"><span><strong>Confidence threshold</strong><small>Send results below this score to review.</small></span><em>{threshold}%</em><input type="range" min="50" max="99" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} /></label>{[["Auto-send low confidence to review", autoReview, setAutoReview],["Detect signatures", signatures, setSignatures],["Include document layout", layout, setLayout],["Preserve normalized raw response", preserveRaw, setPreserveRaw],["Privacy presentation mode", privacy, setPrivacy]].map(([label, checked, setter]) => <label className="switch-row" key={String(label)}><span><strong>{String(label)}</strong><small>{String(label).includes("Privacy") ? "Masks sensitive-looking values in the interface only." : "Frontend demo preference"}</small></span><input type="checkbox" checked={Boolean(checked)} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} /><i /></label>)}</div></Collapsible>
    </div>
    <aside className="upload-aside"><Card className="preflight-card"><div className="card-heading"><div><h2>Document preflight</h2><p>Metadata-based readiness checks</p></div><span className={file ? "preflight-ready" : "preflight-waiting"}>{file ? "READY" : "WAITING"}</span></div><div className="preflight-list">{[
      ["Supported format", file ? file.name.split(".").pop()?.toUpperCase() : "Choose a file"], ["File size", file ? `${(file.size/1024/1024).toFixed(2)} MB` : `Up to ${DOCUMENT_RULES.maxDemoFileSizeMb} MB`], ["Readable document", file ? "Not visually analyzed" : "Not checked"], ["Page information", file?.type === "application/pdf" ? "Available after processing" : file ? "1 image" : "Not available"], ["Mode recommendation", file ? (file.type === "application/pdf" ? "Automatic" : "Text Detection") : "Pending"]
    ].map(([label, value], index) => <div key={label}><span className={file && index < 2 ? "check-ready" : "check-neutral"}>{file && index < 2 ? <Check size={14} /> : <Circle size={10} />}</span><span><strong>{label}</strong><small>{value}</small></span></div>)}</div><div className="preflight-note"><Info size={15} /><p>Preflight uses file metadata only. No AI quality analysis has been performed.</p></div></Card>
      <Card className="tips-card"><h3>For best results</h3><ul><li><CheckCircle2 size={15} /> Use readable, high-contrast text</li><li><CheckCircle2 size={15} /> Avoid cropped edges and extreme blur</li><li><CheckCircle2 size={15} /> Capture pages in good, even lighting</li><li><CheckCircle2 size={15} /> Use the original PDF when available</li></ul></Card>
      <Card className="async-guide"><div><HelpCircle size={18} /><strong>Future processing path</strong></div><p>Small documents may use synchronous analysis. Large or multi-page jobs will follow S3 → StartDocumentAnalysis → SNS/SQS → normalization.</p></Card>
      <button className="btn btn-primary btn-lg full-width process-button" disabled={!file} onClick={() => void runProcessing(false)}><ScanLine size={18} /> Process Document</button><p className="privacy-caption"><Lock size={13} /> Local demo only. No file is uploaded externally.</p>
    </aside>
  </div>;
}

function ProcessingPipeline({ progress }: { progress: number }) {
  const activeIndex = progress >= 84 ? 4 : progress >= 68 ? 3 : progress >= 48 ? 2 : progress >= 12 ? 1 : 0;
  return <div className="processing-experience reveal"><div className="processing-heading"><span className="processing-orbit"><ScanLine size={28} /></span><span className="eyebrow">DOCUMENT PROCESSING</span><h1>Transforming your document</h1><p>Simulating the production AWS document-intelligence pipeline.</p></div><PipelineIndicator activeIndex={activeIndex} complete={progress >= 100} /><Card className="pipeline-card"><div className="pipeline-progress"><span style={{ width: `${progress}%` }} /></div><div className="pipeline-percent"><strong>{progress}%</strong><small>Do not close this window</small></div><div className="pipeline-stages">{stages.map((stage, index) => { const complete = progress >= stage.at; const active = !complete && (index === 0 || progress >= stages[index - 1].at); const Icon = stage.icon; return <div className={cn("pipeline-stage", complete && "complete", active && "active")} key={stage.label}><span>{complete ? <Check size={18} /> : active ? <LoaderCircle className="spin" size={18} /> : <Icon size={18} />}</span><div><strong>{stage.label}</strong><small>{stage.sub}</small></div><em>{complete ? "Complete" : active ? "Processing" : "Waiting"}</em></div>; })}</div></Card><DemoDisclaimer /><div className="processing-security"><ShieldCheck size={16} /> Secure architecture concept · local simulation · no external transfer</div></div>;
}
