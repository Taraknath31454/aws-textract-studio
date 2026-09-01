import { ShieldCheck } from "lucide-react";
import { ReviewQueue } from "@/components/review/review-queue";
import { PageHeader } from "@/components/ui/common";

export default function ReviewPage() { return <div className="page-stack"><PageHeader eyebrow="CONFIDENCE-GUIDED REVIEW" title="Human review queue" description="Validate uncertain values, preserve corrections, and keep a clear machine-versus-human audit trail." actions={<span className="review-policy"><ShieldCheck size={16} /> Threshold policy active</span>} /><ReviewQueue /></div>; }

