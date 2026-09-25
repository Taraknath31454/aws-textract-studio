"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Database, FileCheck2, Files, ScanLine, Upload, Workflow } from "lucide-react";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Card, Confidence, EmptyState, PageHeader, StatusBadge } from "@/components/ui/common";
import { useDocuments } from "@/hooks/use-documents";
import { useApp } from "@/lib/context/app-context";
import { formatDocumentDate, getDocumentStatusLabel } from "@/lib/utils/documents";

export default function DashboardPage() {
  const { documents, isLoading } = useDocuments();
  const { reviews } = useApp();
  const completed = documents.filter((document) => document.status === "COMPLETED");
  const confidenceValues = completed.flatMap((document) => document.confidence === undefined ? [] : [document.confidence]);
  const averageConfidence = confidenceValues.length ? confidenceValues.reduce((total, value) => total + value, 0) / confidenceValues.length : 0;
  const pendingReviews = reviews.filter((item) => item.status === "Pending" || item.status === "Flagged");
  const pageCount = documents.reduce((total, document) => total + document.pageCount, 0);
  const completionRate = documents.length ? completed.length / documents.length * 100 : 0;
  const recentDocuments = documents.slice(0, 5);
  const stats = [
    { label: "Completed documents", value: completed.length, decimals: 0, suffix: "", icon: Files, warn: false },
    { label: "Average confidence", value: averageConfidence, decimals: 1, suffix: "%", icon: FileCheck2, warn: false },
    { label: "Review items", value: pendingReviews.length, decimals: 0, suffix: "", icon: AlertTriangle, warn: pendingReviews.length > 0 },
    { label: "Pages in repository", value: pageCount, decimals: 0, suffix: "", icon: ScanLine, warn: false },
  ] as const;

  return <div className="page-stack dashboard-page">
    <PageHeader eyebrow="WORKSPACE OVERVIEW" title="Document intelligence" description="A precise view of local processing records, extraction quality, and fields awaiting review." actions={<Link href="/upload" className="btn btn-primary"><Upload size={17} /> Process document</Link>} />
    <section className="stats-grid" aria-label="Repository summary">
      {isLoading ? Array.from({ length: 4 }, (_, index) => <div className="skeleton skeleton-card" key={index} />) : stats.map(({ label, value, decimals, suffix, icon: Icon, warn }) => <Card className="stat-card" key={label}><div className={warn ? "stat-icon warning" : "stat-icon"}><Icon size={20} /></div><div><span>{label}</span><strong><AnimatedNumber value={value} decimals={decimals} suffix={suffix} /></strong><small className={warn ? "warning-text" : "stat-context"}>{warn ? "Action available" : "Local demo data"}</small></div></Card>)}
    </section>
    <div className="dashboard-grid">
      <Card className="activity-card"><div className="card-heading"><div><h2>Extraction quality</h2><p>Confidence across the most recent completed documents</p></div><span className="metric-context">{completed.length} completed</span></div><ActivityChart values={confidenceValues.slice(0, 8).reverse()} /><div className="chart-summary"><span><i className="cyan-dot" /> Average confidence</span><strong>{averageConfidence.toFixed(1)}%</strong></div></Card>
      <Card className="attention-card"><div className="card-heading"><div><h2>Needs attention</h2><p>Fields routed by the review policy</p></div><Link href="/review">Open queue <ArrowRight size={14} /></Link></div>{pendingReviews.length ? <div className="attention-list">{pendingReviews.slice(0, 3).map((item) => <Link href="/review" className="attention-item" key={item.id}><span className="attention-icon"><AlertTriangle size={16} /></span><span><strong>{item.field}</strong><small>{item.documentName}</small></span><span className="attention-meta"><em>{item.confidence.toFixed(1)}%</em><small>{item.reason}</small></span><ArrowRight size={15} /></Link>)}</div> : <EmptyState icon={<CheckCircle2 size={25} />} title="Review queue is clear" description="No fields currently require attention." />}<Link href="/review" className="btn btn-secondary full-width">Review extracted fields</Link></Card>
    </div>
    <Card className="table-card"><div className="card-heading"><div><h2>Recent documents</h2><p>Latest records in the local repository</p></div><Link href="/documents">View repository <ArrowRight size={14} /></Link></div><div className="table-wrap"><table><thead><tr><th>Document</th><th>Type</th><th>Pages</th><th>Mode</th><th>Confidence</th><th>Status</th><th>Added</th></tr></thead><tbody>{recentDocuments.map((document) => <tr key={document.id}><td><Link className="doc-cell" href={`/documents/${document.id}`}><span><ScanLine size={18} /></span><span><strong>{document.fileName}</strong><small>{document.id}</small></span></Link></td><td>{document.documentType}</td><td>{document.pageCount}</td><td><span className="mode-label">{document.extractionMode}</span></td><td><Confidence value={document.confidence ?? 0} /></td><td><StatusBadge status={getDocumentStatusLabel(document)} /></td><td className="muted-cell">{formatDocumentDate(document.createdAt)}</td></tr>)}</tbody></table></div></Card>
    <div className="bottom-grid">
      <Card className="architecture-status"><div className="card-heading"><div><h2>Integration boundary</h2><p>The current data path remains deliberately local</p></div><span className="mode-state">MOCK MODE</span></div><div className="service-list">{[["Interface","Ready",Workflow],["Mock adapter","Active",CheckCircle2],["API adapter","Scaffolded",Database],["AWS services","Not connected",Database]].map(([name,status,Icon]) => <div key={String(name)}><span><span className={status === "Active" || status === "Ready" ? "service-icon ready" : "service-icon"}>{typeof Icon !== "string" && <Icon size={16} />}</span>{String(name)}</span><em className={status === "Active" || status === "Ready" ? "ready" : ""}>{String(status)}</em></div>)}</div></Card>
      <Card className="quick-start"><div><span className="stat-icon"><ScanLine size={20} /></span><h2>Inspect the complete demo</h2><p>Open a traceable invoice result with fields, tables, confidence heatmap, review context, and local export.</p></div><Link className="btn btn-primary" href="/documents/demo-001">Open demo document <ArrowRight size={16} /></Link></Card>
    </div>
    <p className="dashboard-footnote">Completion rate in the current repository: {completionRate.toFixed(0)}%. Values reflect local mock records only.</p>
  </div>;
}
