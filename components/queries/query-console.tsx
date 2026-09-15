"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Focus, ScanSearch, Sparkles } from "lucide-react";

const suggestions = ["Who is the vendor?", "What is the total amount?", "List all line items."] as const;

function resolveDemoAnswer(question: string) {
  const normalized = question.toLowerCase();
  if (normalized.includes("vendor")) return { answer: "Acme Systems", confidence: 99.4, source: "Page 1 · Vendor identity block" };
  if (normalized.includes("total")) return { answer: "₹42,580.00", confidence: 99.7, source: "Page 1 · Invoice totals" };
  if (normalized.includes("line item")) return { answer: "Cloud Infrastructure Setup; Technical Support", confidence: 96.8, source: "Page 1 · Line-items table" };
  if (normalized.includes("date")) return { answer: "02 Sep 2026", confidence: 98.9, source: "Page 1 · Invoice metadata" };
  return { answer: "INV-2026-1042", confidence: 98.8, source: "Page 1 · Invoice number field" };
}

export function QueryConsole() {
  const reduceMotion = useReducedMotion();
  const [question, setQuestion] = useState("What is the invoice number?");
  const [submittedQuestion, setSubmittedQuestion] = useState("What is the invoice number?");
  const [answer, setAnswer] = useState("INV-2026-1042");
  const [confidence, setConfidence] = useState(98.8);
  const [source, setSource] = useState("Page 1 · Invoice number field");
  const [phase, setPhase] = useState<"idle" | "thinking" | "typing" | "done">("idle");
  const frameRef = useRef<number | null>(null);
  const delayRef = useRef<number | null>(null);

  const stopAnimation = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (delayRef.current !== null) window.clearTimeout(delayRef.current);
  };

  useEffect(() => () => stopAnimation(), []);

  function runQuery(event?: FormEvent) {
    event?.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    stopAnimation();
    const result = resolveDemoAnswer(cleanQuestion);
    setSubmittedQuestion(cleanQuestion);
    setAnswer("");
    setPhase("thinking");
    delayRef.current = window.setTimeout(() => {
      setConfidence(result.confidence);
      setSource(result.source);
      if (reduceMotion) {
        setAnswer(result.answer);
        setPhase("done");
        return;
      }
      setPhase("typing");
      const startedAt = performance.now();
      const tick = (now: number) => {
        const length = Math.min(result.answer.length, Math.floor((now - startedAt) / 18) + 1);
        setAnswer(result.answer.slice(0, length));
        if (length < result.answer.length) frameRef.current = requestAnimationFrame(tick);
        else setPhase("done");
      };
      frameRef.current = requestAnimationFrame(tick);
    }, reduceMotion ? 120 : 520);
  }

  return (
    <section className="query-console cyber-chamfer" aria-labelledby="query-console-title">
      <div className="query-console-head">
        <div><span className="terminal-dots" aria-hidden="true"><i /><i /><i /></span><strong id="query-console-title">QUERY_ENGINE / READY</strong></div>
        <span><i /> DOCUMENT: demo-001</span>
      </div>
      <div className="query-console-body">
        <form onSubmit={runQuery}>
          <label htmlFor="document-query">Test a document extraction query</label>
          <div className="terminal-input"><span aria-hidden="true">›</span><input id="document-query" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a specific question about this document…" /><button type="submit" aria-label="Run demo query"><ArrowRight size={17} /></button></div>
        </form>
        <div className="query-suggestions" aria-label="Suggested queries">{suggestions.map((item) => <button type="button" key={item} onClick={() => setQuestion(item)}>{item}</button>)}</div>
        <div className="query-console-result" aria-live="polite" aria-busy={phase === "thinking" || phase === "typing"}>
          <div className="query-result-label"><Sparkles size={14} /><span>{phase === "thinking" ? "ANALYZING_DOCUMENT..." : "STRUCTURED_ANSWER"}</span><em>{phase === "thinking" ? "PROCESSING" : "EXTRACTION COMPLETE"}</em></div>
          <small>{submittedQuestion}</small>
          {phase === "thinking" ? <div className="query-thinking"><i /><i /><i /></div> : <p>{answer}{phase === "typing" && <span className="terminal-cursor" aria-hidden="true" />}</p>}
          <div className="query-result-meta"><span><CheckCircle2 size={13} /> Confidence <strong>{confidence.toFixed(1)}%</strong></span><span><Focus size={13} /> {source}</span><span><ScanSearch size={13} /> Source Trace ready</span></div>
        </div>
      </div>
    </section>
  );
}
