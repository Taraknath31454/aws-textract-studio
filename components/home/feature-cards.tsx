"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileStack, ScanText, TableProperties, Tags } from "lucide-react";

const features = [
  {
    icon: ScanText,
    number: "01",
    title: "Text Extraction",
    copy: "Extract printed and handwritten text from complex documents.",
  },
  {
    icon: TableProperties,
    number: "02",
    title: "Table Analysis",
    copy: "Detect rows, columns, headers, and cells while preserving structure.",
  },
  {
    icon: Tags,
    number: "03",
    title: "Form & Key-Value",
    copy: "Identify labels and values and turn forms into usable records.",
  },
  {
    icon: FileStack,
    number: "04",
    title: "Document Types",
    copy: "Work with invoices, IDs, forms, contracts, and more.",
  },
] as const;

export function FeatureCards() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="home-feature-grid"
      id="use-cases"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {features.map(({ icon: Icon, number, title, copy }) => (
        <motion.article
          className="home-feature-card"
          key={title}
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.32 }}
          whileHover={reduceMotion ? undefined : { y: -4 }}
        >
          <div className="home-feature-top">
            <span><Icon size={19} aria-hidden="true" /></span>
            <em>{number}</em>
          </div>
          <h3>{title}</h3>
          <p>{copy}</p>
          <i aria-hidden="true" />
        </motion.article>
      ))}
    </motion.div>
  );
}
