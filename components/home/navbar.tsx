"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, MoonStar, ScanText, X } from "lucide-react";

const navItems = [
  ["Home", "#home"],
  ["Features", "#features"],
  ["How It Works", "#how-it-works"],
  ["Use Cases", "#use-cases"],
  ["Pricing", "#pricing"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

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
            {navItems.map(([label, href], index) => (
              <a
                className={index === 0 ? "is-active" : undefined}
                href={href}
                key={label}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="home-nav-actions">
            <span className="home-theme-orb" title="Dark interface" aria-hidden="true">
              <MoonStar size={15} aria-hidden="true" />
            </span>
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
