import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/ui/brand";

export function AuthShell({ children, visual }: { children: React.ReactNode; visual?: React.ReactNode }) {
  return <main className={visual ? "auth-page" : "auth-page auth-page-centered"}><header className="auth-header"><Brand /><div><span>FRONTEND DEMO MODE</span><Link href="/"><ArrowLeft size={14} /> Back to home</Link></div></header>{visual && <section className="auth-visual-panel">{visual}</section>}<section className="auth-form-panel">{children}</section></main>;
}

