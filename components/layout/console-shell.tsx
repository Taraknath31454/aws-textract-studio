"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, Bell, ChevronRight, CircleGauge, FileSearch, Files, FlaskConical, Menu, Plus, Search, Settings, Upload, X } from "lucide-react";
import { Brand } from "@/components/ui/brand";
import { cn } from "@/lib/utils/format";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: CircleGauge },
  { href: "/upload", label: "Upload Document", icon: Upload },
  { href: "/documents", label: "Documents", icon: Files },
  { href: "/review", label: "Review Queue", icon: FileSearch, count: 3 },
  { href: "/query-lab", label: "Query Lab", icon: FlaskConical },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const [open, setOpen] = useState(false);
  const current = navItems.find((item) => pathname === item.href || (item.href === "/documents" && pathname.startsWith("/documents/"))) ?? navItems[0];
  const context = pathname.startsWith("/upload") ? "upload" : pathname.startsWith("/review") ? "review" : pathname.startsWith("/documents/") ? "document" : pathname.replace("/", "") || "dashboard";
  return <div className={cn("console-shell", `console-context-${context}`)}>
    <div className="console-ambient" aria-hidden="true" />
    <aside className={cn("sidebar", open && "sidebar-open")}>
      <div className="sidebar-brand"><Brand href="/dashboard" /><button className="icon-btn mobile-only" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={19} /></button></div>
      <div className="sidebar-system" aria-hidden="true"><span>DOC_ENGINE</span><em><i /> READY</em></div>
      <span className="sidebar-label">WORKSPACE</span>
      <nav aria-label="Workspace navigation">{navItems.map(({ href, label, icon: Icon, count }) => { const active = pathname === href || (href === "/documents" && pathname.startsWith("/documents/")); return <Link key={href} href={href} className={cn("nav-link", active && "active")} onClick={() => setOpen(false)}><Icon size={18} /><span>{label}</span>{count && <em>{count}</em>}{active && <ChevronRight className="nav-arrow" size={15} />}</Link>; })}</nav>
      <div className="sidebar-bottom"><div className="demo-mode-card"><span className="pulse-dot" /><div><strong>Demo Mode</strong><small>Frontend simulation</small></div></div><p>No files leave your browser.</p></div>
    </aside>
    {open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
    <div className="console-main">
      <header className="topbar"><button className="icon-btn mobile-only" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="topbar-context"><span>WORKSPACE /</span><strong>{current.label}</strong></div><div className="topbar-search"><Search size={16} /><input aria-label="Global search" placeholder="Search documents, IDs, or fields…" /><kbd>Ctrl K</kbd></div><div className="topbar-actions"><span className="system-status"><i />SYSTEM: ONLINE</span><span className="demo-badge">DEMO MODE</span><button className="icon-btn notification" aria-label="Notifications"><Bell size={18} /><i /></button><button className="avatar" aria-label="Open profile menu">TS</button></div></header>
      <main className="content">{children}</main>
    </div>
    <Link href="/upload" className="mobile-fab" aria-label="Process a document"><Plus size={22} /></Link>
  </div>;
}
