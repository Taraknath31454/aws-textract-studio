import Link from "next/link";
import { Upload } from "lucide-react";
import { DocumentRepository } from "@/components/documents/document-repository";
import { Card, PageHeader } from "@/components/ui/common";

export default async function DocumentsPage({ searchParams }: PageProps<"/documents">) { const params = await searchParams; const initialQuery = typeof params.query === "string" ? params.query : ""; return <div className="page-stack"><PageHeader eyebrow="DOCUMENT REPOSITORY" title="Documents" description="Search, filter, review, and export every processing record." actions={<Link href="/upload" className="btn btn-primary"><Upload size={16} /> Process document</Link>} /><Card className="repository-card"><DocumentRepository key={initialQuery} initialQuery={initialQuery} /></Card></div>; }

