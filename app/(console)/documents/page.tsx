import Link from "next/link";
import { Upload } from "lucide-react";
import { DocumentRepository } from "@/components/documents/document-repository";
import { Card, PageHeader } from "@/components/ui/common";

export default function DocumentsPage() { return <div className="page-stack"><PageHeader eyebrow="DOCUMENT REPOSITORY" title="Documents" description="Search, filter, review, and export every processing record." actions={<Link href="/upload" className="btn btn-primary"><Upload size={16} /> Process Document</Link>} /><Card className="repository-card"><DocumentRepository /></Card></div>; }

