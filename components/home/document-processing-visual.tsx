"use client";

import type { PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Check, Cloud, FileSearch2, Sparkles } from "lucide-react";

const extractedFields = [
  ["Invoice Number", "INV-2026-045", "99.2%"],
  ["Date", "02 Sep 2026", "98.7%"],
  ["Vendor", "ABC Electronics", "99.5%"],
  ["Total Amount", "₹65,000", "99.8%"],
] as const;

const panelVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.48, staggerChildren: 0.09 } },
};

const fieldVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28 } },
};

export function DocumentProcessingVisual() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.7 });
  const rotateY = useTransform(smoothX, [-1, 1], [-2.4, 2.4]);
  const rotateX = useTransform(smoothY, [-1, 1], [2, -2]);
  const sceneX = useTransform(smoothX, [-1, 1], [-4, 4]);
  const sceneY = useTransform(smoothY, [-1, 1], [-3, 3]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      className="processing-scene"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label="Animated invoice moving through a simulated document extraction workflow"
    >
      <div className="scene-glow" aria-hidden="true" />
      <div className="scene-stars" aria-hidden="true"><i /><i /><i /><i /><i /></div>

      <motion.div
        className="processing-world"
        style={reduceMotion ? undefined : { rotateX, rotateY, x: sceneX, y: sceneY }}
      >
        <motion.div
          className="home-cloud-node"
          animate={reduceMotion ? undefined : { y: [0, -5, 0], scale: [1, 1.025, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span aria-hidden="true"><Cloud size={27} /></span>
          <div><strong>Secure cloud</strong><small>Document received</small></div>
          <i aria-hidden="true" />
        </motion.div>

        <svg className="processing-paths" viewBox="0 0 680 470" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="homeFlowGradient" x1="0" x2="1">
              <stop offset="0" stopColor="#35c8ff" stopOpacity=".14" />
              <stop offset=".55" stopColor="#6586ff" stopOpacity=".9" />
              <stop offset="1" stopColor="#9b72ff" stopOpacity=".22" />
            </linearGradient>
          </defs>
          <path className="processing-path processing-path-muted" d="M338 92 C338 123 322 138 310 158" />
          <path className="processing-path processing-path-live" d="M426 259 C470 258 471 214 511 213" />
          <path className="processing-path processing-path-live path-delay" d="M430 284 C475 288 478 335 514 336" />
          <motion.circle r="2.5" fill="#72e4ff" animate={reduceMotion ? undefined : { cx: [426, 470, 511], cy: [259, 245, 213], opacity: [0, 1, 0] }} transition={{ duration: 2.1, repeat: Infinity, ease: "linear" }} />
          <motion.circle r="2.2" fill="#8f78ff" animate={reduceMotion ? undefined : { cx: [430, 476, 514], cy: [284, 307, 336], opacity: [0, 1, 0] }} transition={{ duration: 2.35, repeat: Infinity, ease: "linear", delay: .7 }} />
        </svg>

        <motion.article
          className="home-invoice-float"
          animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="home-invoice">
            <div className="invoice-topline">
              <div className="invoice-logo"><span>ABC</span><small>ELECTRONICS</small></div>
              <b>INVOICE</b>
            </div>
            <div className="invoice-meta-grid">
              <div><small>BILL TO</small><strong>Nova Retail Pvt. Ltd.</strong><span>Mumbai, Maharashtra</span></div>
              <div><small>INVOICE NO.</small><strong>INV-2026-045</strong><small>02 SEP 2026</small></div>
            </div>
            <div className="invoice-table">
              <div className="invoice-table-head"><span>DESCRIPTION</span><span>QTY</span><span>AMOUNT</span></div>
              <div><span>Industrial sensor kit</span><span>2</span><b>₹36,000</b></div>
              <div><span>Edge gateway module</span><span>1</span><b>₹21,000</b></div>
              <div><span>Installation service</span><span>1</span><b>₹8,000</b></div>
            </div>
            <div className="invoice-total"><span>TOTAL</span><strong>₹65,000</strong></div>
            <div className="invoice-footer-line"><span /><span /></div>
            <div className="home-scan-beam" aria-hidden="true"><i /></div>
            <span className="invoice-corner corner-one" aria-hidden="true" />
            <span className="invoice-corner corner-two" aria-hidden="true" />
            <span className="scan-detection marker-vendor" aria-hidden="true">VENDOR_DETECTED</span>
            <span className="scan-detection marker-id" aria-hidden="true">INVOICE_ID</span>
            <span className="scan-detection marker-total" aria-hidden="true">TOTAL</span>
          </div>
        </motion.article>

        <motion.aside
          className="extraction-panel"
          variants={panelVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <div className="extraction-heading">
            <span><FileSearch2 size={16} aria-hidden="true" /></span>
            <div><strong>Extracted Data</strong><small>Structured output</small></div>
            <Sparkles size={13} aria-hidden="true" />
          </div>
          <div className="extraction-fields">
            {extractedFields.map(([label, value, confidence]) => (
              <motion.div className="extraction-field" variants={fieldVariants} key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <em>{confidence}</em>
              </motion.div>
            ))}
          </div>
          <motion.div className="extraction-complete" variants={fieldVariants}>
            <span><Check size={12} aria-hidden="true" /></span>
            <div><strong>Processing Complete</strong><small>Ready for review</small></div>
          </motion.div>
        </motion.aside>

        <div className="home-pedestal" aria-hidden="true"><span /></div>
        <div className="scene-system-status" aria-hidden="true"><i /> SYSTEM_STATUS: ONLINE</div>
        <div className="scene-caption">
          <span>From Documents to Possibilities</span>
          <strong>SCAN <i>›</i> EXTRACT <i>›</i> STRUCTURE <i>›</i> EMPOWER</strong>
        </div>
      </motion.div>
    </div>
  );
}
