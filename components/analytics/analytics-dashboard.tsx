"use client";

import { AlertTriangle, CheckCircle2, FileText, Files, Gauge, Layers3, TrendingUp } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Card, EmptyState } from "@/components/ui/common";
import { useDocuments } from "@/hooks/use-documents";
import { useApp } from "@/lib/context/app-context";

export function AnalyticsDashboard() {
  const { documents, isLoading } = useDocuments();
  const { reviews } = useApp();
  const completed = documents.filter((document) => document.status === "COMPLETED");
  const confidences = completed.flatMap((document) => document.confidence === undefined ? [] : [document.confidence]);
  const average = confidences.length ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length : 0;
  const pages = documents.reduce((sum, document) => sum + document.pageCount, 0);
  const pending = reviews.filter((review) => review.status === "Pending" || review.status === "Flagged").length;
  const successRate = documents.length ? completed.length / documents.length * 100 : 0;
  const reviewRate = reviews.length ? pending / reviews.length * 100 : 0;
  const confidenceGroups = [
    { label: "High", count: confidences.filter((value) => value >= 90).length, className: "high" },
    { label: "Medium", count: confidences.filter((value) => value >= 80 && value < 90).length, className: "medium" },
    { label: "Needs review", count: confidences.filter((value) => value < 80).length, className: "low" },
  ];
  const typeCounts = Array.from(new Set(documents.map((document) => document.documentType))).map((label) => ({ label, count: documents.filter((document) => document.documentType === label).length })).sort((a, b) => b.count - a.count);
  const reasons = Array.from(new Set(reviews.map((review) => review.reason))).map((label) => ({ label, count: reviews.filter((review) => review.reason === label).length }));
  const metrics = [
    { label: "Documents", value: documents.length, icon: Files },
    { label: "Pages", value: pages, icon: FileText },
    { label: "Average confidence", value: average, decimals: 1, suffix: "%", icon: Gauge },
    { label: "Completed", value: completed.length, icon: Layers3 },
    { label: "Review rate", value: reviewRate, decimals: 1, suffix: "%", icon: AlertTriangle },
    { label: "Completion rate", value: successRate, decimals: 1, suffix: "%", icon: CheckCircle2 },
  ];

  if (isLoading) return <div className="analytics-loading"><div className="skeleton-grid">{Array.from({ length: 6 }, (_, index) => <div className="skeleton skeleton-card" key={index} />)}</div><div className="skeleton skeleton-panel" /></div>;
  if (!documents.length) return <EmptyState icon={<Files size={30} />} title="No analytics yet" description="Process a document to populate local workflow analytics." />;

  return <div className="analytics-dashboard">
    <section className="analytics-stats" aria-label="Local repository metrics">{metrics.map(({ label, value, decimals = 0, suffix = "", icon: Icon }) => <Card className="analytics-stat" key={label}><span><Icon size={18} /></span><div><small>{label}</small><strong><AnimatedNumber value={value} decimals={decimals} suffix={suffix} /></strong><em>Current repository</em></div></Card>)}</section>
    <div className="analytics-grid">
      <Card className="documents-chart"><div className="card-heading"><div><h2>Confidence by document</h2><p>Completed records, ordered by recency</p></div><span className="metric-context">LOCAL DATA</span></div><div className="bar-chart" aria-label="Confidence of completed documents">{completed.map((document) => <div key={document.id}><i style={{ height: `${document.confidence ?? 0}%` }}><span>{document.confidence?.toFixed(1)}%</span></i><small title={document.fileName}>{document.id.replace("demo-", "D")}</small></div>)}</div></Card>
      <Card className="confidence-panel"><div className="card-heading"><div><h2>Confidence distribution</h2><p>Completed document records</p></div></div><div className="distribution-list">{confidenceGroups.map((group) => { const percentage = confidences.length ? group.count / confidences.length * 100 : 0; return <div key={group.label}><span><i className={group.className} />{group.label}</span><div><i className={group.className} style={{ width: `${percentage}%` }} /></div><strong>{group.count}</strong></div>; })}</div></Card>
      <Card><div className="card-heading"><div><h2>Document types</h2><p>Current repository mix</p></div></div><div className="type-bars">{typeCounts.map(({ label, count }) => <div key={label}><span>{label}</span><div><i style={{ width: `${count / documents.length * 100}%` }} /></div><strong>{count}</strong></div>)}</div></Card>
      <Card><div className="card-heading"><div><h2>Review reasons</h2><p>Why fields entered human review</p></div></div><div className="reason-chart">{reasons.map(({ label, count }, index) => <div key={label}><span className={`reason-${index}`}>{count}</span><div><strong>{label}</strong><small>{count === 1 ? "1 field" : `${count} fields`}</small></div></div>)}</div></Card>
    </div>
    <section className="quality-section"><div className="quality-heading"><span><TrendingUp size={20} /></span><div><h2>Extraction quality</h2><p>Threshold-based view of completed local records</p></div></div><div className="quality-cards">{confidenceGroups.map((group) => <div key={group.label}><span className={group.className}>{group.className === "high" ? <CheckCircle2 size={19} /> : group.className === "medium" ? <Gauge size={19} /> : <AlertTriangle size={19} />}</span><small>{group.className === "high" ? "90–100%" : group.className === "medium" ? "80–89.99%" : "Below 80%"}</small><strong>{group.count}</strong><h3>{group.label}</h3><p>{group.count === 1 ? "1 document" : `${group.count} documents`}</p></div>)}</div></section>
    <p className="analytics-note">All analytics are calculated from the records currently stored in this browser. No remote telemetry is collected.</p>
  </div>;
}
