"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, Database, FileCheck2, Files, MoreHorizontal, ScanLine, TrendingUp, Upload, Zap } from "lucide-react";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { Card, Confidence, PageHeader, StatusBadge } from "@/components/ui/common";
import { useApp } from "@/lib/context/app-context";

const stats = [
  { label: "Documents Processed", value: "1,284", change: "+12.8%", icon: Files },
  { label: "Average Confidence", value: "94.6%", change: "+1.4%", icon: TrendingUp },
  { label: "Needs Review", value: "18", change: "6 urgent", icon: AlertTriangle, warn: true },
  { label: "Completed Today", value: "47", change: "of 51 jobs", icon: FileCheck2 },
];

export default function DashboardPage() {
  const { documents } = useApp();
  return <div className="page-stack">
    <PageHeader eyebrow="GOOD EVENING, TARA" title="Document Intelligence Overview" description="Monitor extraction quality, processing activity, and documents that need attention." actions={<Link href="/upload" className="btn btn-primary"><Upload size={17} /> Process Document</Link>} />
    <div className="stats-grid">{stats.map(({ label, value, change, icon: Icon, warn }) => <Card className="stat-card reveal" key={label}><div className={warn ? "stat-icon warning" : "stat-icon"}><Icon size={20} /></div><div><span>{label}</span><strong>{value}</strong><small className={warn ? "warning-text" : "positive-text"}>{change}</small></div></Card>)}</div>
    <div className="dashboard-grid">
      <Card className="activity-card"><div className="card-heading"><div><h2>Processing Activity</h2><p>Documents analyzed over the last 14 days</p></div><select aria-label="Activity period" defaultValue="14"><option value="14">Last 14 days</option><option value="30">Last 30 days</option></select></div><ActivityChart /><div className="chart-summary"><span><i className="cyan-dot" /> Documents processed</span><strong>842 <small>total</small></strong></div></Card>
      <Card className="attention-card"><div className="card-heading"><div><h2>Needs Attention</h2><p>Priority review items</p></div><Link href="/review">View queue <ArrowRight size={14} /></Link></div><div className="attention-list">{[
        ["PO Number", "Acme_Invoice_1042.pdf", "78.4%", "Low confidence"], ["Total", "Travel_Receipt.jpg", "72.1%", "Scan quality"], ["Applicant ID", "Vendor_Application.pdf", "81.7%", "Ambiguous text"]
      ].map(([field, doc, confidence, reason]) => <Link href="/review" className="attention-item" key={field}><span className="attention-icon"><AlertTriangle size={16} /></span><span><strong>{field}</strong><small>{doc}</small></span><span className="attention-meta"><em>{confidence}</em><small>{reason}</small></span><ArrowRight size={15} /></Link>)}</div><Link href="/review" className="btn btn-secondary full-width">Open Confidence-Guided Review</Link></Card>
    </div>
    <Card className="table-card"><div className="card-heading"><div><h2>Recent Documents</h2><p>Latest files across your processing workspace</p></div><Link href="/documents">View all documents <ArrowRight size={14} /></Link></div><div className="table-wrap"><table><thead><tr><th>Document</th><th>Type</th><th>Pages</th><th>Extraction Mode</th><th>Confidence</th><th>Status</th><th>Uploaded</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{documents.slice(0, 5).map((document) => <tr key={document.id}><td><Link className="doc-cell" href={`/documents/${document.id}`}><span><ScanLine size={18} /></span><span><strong>{document.name}</strong><small>{document.id}</small></span></Link></td><td>{document.type}</td><td>{document.pages}</td><td><span className="mode-pill">{document.mode}</span></td><td><Confidence value={document.confidence} /></td><td><StatusBadge status={document.status} /></td><td className="muted-cell">{document.uploadedAt}</td><td><button className="icon-btn" aria-label={`Actions for ${document.name}`}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></Card>
    <div className="bottom-grid"><Card className="architecture-status"><div className="card-heading"><div><h2>Architecture Status</h2><p>Current demo integration state</p></div><span className="live-badge"><i /> FRONTEND LIVE</span></div><div className="service-list">{[["Frontend","Ready",CheckCircle2],["Amazon S3","Demo",Database],["AWS Lambda","Demo",Zap],["Amazon Textract","Demo",ScanLine],["DynamoDB","Demo",Database]].map(([name,status,Icon]) => <div key={String(name)}><span><span className={status === "Ready" ? "service-icon ready" : "service-icon"}>{typeof Icon !== "string" && <Icon size={16} />}</span>{String(name)}</span><em className={status === "Ready" ? "ready" : ""}>{String(status)}</em></div>)}</div></Card><Card className="quick-start"><div><span className="stat-icon"><Clock3 size={20} /></span><h2>Judge-ready demo</h2><p>Explore a complete invoice extraction with Source Trace, confidence heatmap, review, and export.</p></div><Link className="btn btn-primary" href="/documents/demo-001">Try Demo Document <ArrowRight size={16} /></Link></Card></div>
  </div>;
}

