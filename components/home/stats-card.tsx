"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Asterisk, Gauge, ShieldCheck, Sparkles } from "lucide-react";

const metrics = [
  ["10x", "Faster Processing"],
  ["99%", "Accurate Extraction"],
  ["∞", "Real-World Use Cases"],
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
        <span><Sparkles size={15} aria-hidden="true" /> BUILT TO SCALE</span>
        <h3>From first upload to production workflow.</h3>
        <p><ShieldCheck size={14} aria-hidden="true" /> Trusted by builders, businesses and innovators.</p>
      </div>
      <div className="home-metrics">
        {metrics.map(([value, label], index) => (
          <div key={label}>
            <span aria-hidden="true">
              {index === 0 ? <Gauge size={15} /> : index === 1 ? <Asterisk size={15} /> : <Sparkles size={15} />}
            </span>
            <strong>{value}</strong>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
