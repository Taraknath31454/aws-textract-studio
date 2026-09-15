"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CirclePlay, CloudCog, ShieldCheck, Sparkles } from "lucide-react";
import { DocumentProcessingVisual } from "./document-processing-visual";

const trustItems = [
  [CloudCog, "Powered by AWS"],
  [ShieldCheck, "Secure & Scalable"],
  [Sparkles, "Built for Real-World Use"],
] as const;

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const transition = { duration: reduceMotion ? 0 : 0.46, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section className="home-hero" id="home">
      <motion.div
        className="home-hero-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        <span className="home-kicker">
          <Sparkles size={13} aria-hidden="true" /> AI-Powered Document Intelligence
        </span>
        <h1>
          Turn Documents into <span>Actionable Data</span>
        </h1>
        <p>
          Upload invoices, forms, IDs, or contracts and transform their text, tables, and key information into clean structured data with an Amazon Textract-ready workflow.
        </p>

        <div className="home-hero-actions">
          <Link href="/upload" className="home-button home-button-primary">
            Start Processing <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <a href="#how-it-works" className="home-button home-button-secondary">
            <CirclePlay size={17} aria-hidden="true" /> Watch Demo
          </a>
        </div>

        <div className="home-trust-row" aria-label="Platform benefits">
          {trustItems.map(([Icon, label]) => (
            <span key={label}>
              <Icon size={13} aria-hidden="true" /> {label}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="home-hero-art"
        id="how-it-works"
        initial={reduceMotion ? false : { opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...transition, delay: reduceMotion ? 0 : 0.08 }}
      >
        <DocumentProcessingVisual />
      </motion.div>
    </section>
  );
}
