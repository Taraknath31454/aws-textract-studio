"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, ScanText, X } from "lucide-react";

const navItems = [
  ["Home", "#home"],
  ["Features", "#features"],
  ["How It Works", "#how-it-works"],
  ["Use Cases", "#use-cases"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const sections = navItems.flatMap(([, href]) => {
      const element = document.querySelector(href);
      return element ? [element] : [];
    });
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(`#${visible.target.id}`);
    }, { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.35, 0.7] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="home-navbar-wrap">
      <nav className="home-navbar" aria-label="Primary navigation">
        <Link className="home-brand" href="/" onClick={() => setOpen(false)}>
          <span className="home-brand-mark" aria-hidden="true">
            <ScanText size={19} />
          </span>
          <span>
            <b>AWS</b> Textract Studio
          </span>
        </Link>

        <button
          className="home-menu-button"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="home-navigation-links"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`home-nav-drawer${open ? " is-open" : ""}`} id="home-navigation-links">
          <div className="home-nav-links">
            {navItems.map(([label, href]) => (
              <a
                className={active === href ? "is-active" : undefined}
                href={href}
                key={label}
                onClick={() => { setActive(href); setOpen(false); }}
                aria-current={active === href ? "location" : undefined}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="home-nav-actions">
            <Link className="home-sign-in" href="/login" onClick={() => setOpen(false)}>
              Sign In
            </Link>
            <Link className="home-button home-button-nav" href="/signup" onClick={() => setOpen(false)}>
              Get Started <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
