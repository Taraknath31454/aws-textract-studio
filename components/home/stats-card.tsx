"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileCheck2, Focus, ShieldCheck, Sparkles } from "lucide-react";

const metrics = [
  ["PDF + image", "Supported input", FileCheck2],
  ["Source-linked", "Review context", Focus],
  ["Mock by default", "Safe demo mode", ShieldCheck],
] as const;

export function StatsCard() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="home-stats-card"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.36 }}
    >
      <div className="home-stats-intro">
        <span><Sparkles size={15} aria-hidden="true" /> DESIGNED FOR INSPECTION</span>
        <h3>Clarity from intake to human review.</h3>
        <p><ShieldCheck size={14} aria-hidden="true" /> Honest demo states. Replaceable service boundary.</p>
      </div>
      <div className="home-metrics">
        {metrics.map(([value, label, Icon]) => (
          <div key={label}>
            <span aria-hidden="true"><Icon size={15} /></span>
            <strong>{value}</strong>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
