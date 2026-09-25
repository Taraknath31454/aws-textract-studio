"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BarChart3, ChevronRight, CircleGauge, FileSearch, Files, FlaskConical, Menu, Plus, Search, Settings, Upload, X } from "lucide-react";
import { Brand } from "@/components/ui/brand";
import { useApp } from "@/lib/context/app-context";
import { cn } from "@/lib/utils/format";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: CircleGauge },
  { href: "/upload", label: "Upload document", icon: Upload },
  { href: "/documents", label: "Documents", icon: Files },
  { href: "/review", label: "Review queue", icon: FileSearch },
  { href: "/query-lab", label: "Query Lab", icon: FlaskConical },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { reviews } = useApp();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const current = navItems.find((item) => pathname === item.href || (item.href === "/documents" && pathname.startsWith("/documents/"))) ?? navItems[0];
  const context = pathname.startsWith("/upload") ? "upload" : pathname.startsWith("/review") ? "review" : pathname.startsWith("/documents/") ? "document" : pathname.replace("/", "") || "dashboard";
  const reviewCount = reviews.filter((item) => item.status === "Pending" || item.status === "Flagged").length;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/documents?query=${encodeURIComponent(query)}` : "/documents");
  };

  return <div className={cn("console-shell", `console-context-${context}`)}>
    <div className="console-ambient" aria-hidden="true" />
    <aside className={cn("sidebar", open && "sidebar-open")}>
      <div className="sidebar-brand"><Brand href="/dashboard" /><button className="icon-btn mobile-only" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={19} /></button></div>
      <div className="sidebar-system" aria-hidden="true"><span>DOCUMENT STUDIO</span><em><i /> MOCK READY</em></div>
      <span className="sidebar-label">WORKSPACE</span>
      <nav aria-label="Workspace navigation">{navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href === "/documents" && pathname.startsWith("/documents/"));
        const count = href === "/review" ? reviewCount : 0;
        return <Link key={href} href={href} className={cn("nav-link", active && "active")} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}><Icon size={18} /><span>{label}</span>{count > 0 && <em aria-label={`${count} items`}>{count}</em>}{active && <ChevronRight className="nav-arrow" size={15} />}</Link>;
      })}</nav>
      <div className="sidebar-bottom"><div className="demo-mode-card"><span className="pulse-dot" /><div><strong>Demo mode</strong><small>Local data adapter</small></div></div><p>No file leaves this browser.</p></div>
    </aside>
    {open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
    <div className="console-main">
      <header className="topbar">
        <button className="icon-btn mobile-only" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
        <div className="topbar-context"><span>WORKSPACE /</span><strong>{current.label}</strong></div>
        <form className="topbar-search" role="search" onSubmit={submitSearch}><Search size={16} /><input ref={searchRef} aria-label="Search documents" placeholder="Search documents or IDs" value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>Ctrl K</kbd></form>
        <div className="topbar-actions"><span className="system-status"><i />LOCAL MODE</span><span className="demo-badge">AWS NOT CONNECTED</span><Link className="avatar" href="/settings" aria-label="Open workspace settings">TS</Link></div>
      </header>
      <main className="content">{children}</main>
    </div>
    <Link href="/upload" className="mobile-fab" aria-label="Process a document"><Plus size={22} /></Link>
  </div>;
}
