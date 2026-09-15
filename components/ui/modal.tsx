"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function Modal({ open, onClose, title, children, actions }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const handler = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", handler);
      window.clearTimeout(focusTimer);
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .16 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
        <motion.div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={reduceMotion ? false : { opacity: 0, scale: .98, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .985, y: 5 }} transition={{ duration: reduceMotion ? 0 : .2, ease: [0.22, 1, 0.36, 1] }}>
          <div className="modal-head"><h2 id="modal-title">{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>
          <div className="modal-body">{children}</div>
          {actions && <div className="modal-actions">{actions}</div>}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
}
