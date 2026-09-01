"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/format";

const eyePositions = [
  { left: 24.7, top: 40.0, character: "a" },
  { left: 29.45, top: 40.8, character: "a" },
  { left: 50.15, top: 43.65, character: "w" },
  { left: 54.85, top: 43.65, character: "w" },
  { left: 73.65, top: 40.9, character: "s" },
  { left: 78.2, top: 40.9, character: "s" },
] as const;

type Point = { x: number; y: number };

export function MascotVisual({ privacyLookAway = false, attentionTarget = null, compact = false }: { privacyLookAway?: boolean; attentionTarget?: "password" | "confirm" | null; compact?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pupilRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const eyeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const centersRef = useRef<Point[]>([]);
  const limitsRef = useRef<Point[]>([]);
  const pointerRef = useRef<Point | null>(null);
  const attentionPointRef = useRef<Point | null>(null);
  const attentionNameRef = useRef(attentionTarget);
  const privacyRef = useRef(privacyLookAway);

  useEffect(() => {
    attentionNameRef.current = attentionTarget;
    const target = attentionTarget ? document.querySelector<HTMLElement>(`[data-mascot-target="${attentionTarget}"]`) : null;
    if (target) { const rect = target.getBoundingClientRect(); attentionPointRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; }
    else attentionPointRef.current = null;
  }, [attentionTarget]);

  useEffect(() => {
    if (privacyLookAway) { privacyRef.current = true; return; }
    const release = window.setTimeout(() => { privacyRef.current = false; }, 420);
    return () => window.clearTimeout(release);
  }, [privacyLookAway]);

  useEffect(() => {
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!precisePointer || reducedMotion) return;

    const current = eyePositions.map(() => ({ x: 0, y: 0 }));
    const measure = () => {
      centersRef.current = eyeRefs.current.map((eye) => { const rect = eye?.getBoundingClientRect(); return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: 0, y: 0 }; });
      limitsRef.current = eyeRefs.current.map((eye, index) => {
        const eyeRect = eye?.getBoundingClientRect(); const pupilRect = pupilRefs.current[index]?.getBoundingClientRect();
        return eyeRect && pupilRect ? { x: Math.max(1, (eyeRect.width - pupilRect.width) / 2 - 2), y: Math.max(1, (eyeRect.height - pupilRect.height) / 2 - 2) } : { x: 5, y: 5 };
      });
      const target = attentionNameRef.current ? document.querySelector<HTMLElement>(`[data-mascot-target="${attentionNameRef.current}"]`) : null;
      if (target) { const rect = target.getBoundingClientRect(); attentionPointRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }; }
    };
    measure();
    const observer = new ResizeObserver(measure); if (stageRef.current) observer.observe(stageRef.current);
    const onPointerMove = (event: PointerEvent) => { if (event.pointerType === "mouse") pointerRef.current = { x: event.clientX, y: event.clientY }; };
    const onPointerLeave = (event: MouseEvent) => { if (!event.relatedTarget) pointerRef.current = null; };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("resize", measure, { passive: true });

    let frame = 0;
    const render = () => {
      const target = attentionPointRef.current ?? pointerRef.current;
      pupilRefs.current.forEach((pupil, index) => {
        if (!pupil) return;
        const limit = limitsRef.current[index] ?? { x: 5, y: 5 };
        let desired = { x: 0, y: 0 };
        if (privacyRef.current) desired = index < 2 ? { x: -limit.x, y: limit.y * .12 } : index < 4 ? { x: 0, y: -limit.y } : { x: limit.x, y: limit.y * .12 };
        else if (target) {
          const center = centersRef.current[index] ?? { x: 0, y: 0 };
          const angle = Math.atan2(target.y - center.y, target.x - center.x);
          const attentiveness = attentionPointRef.current ? .92 : .8;
          desired = { x: Math.cos(angle) * limit.x * attentiveness, y: Math.sin(angle) * limit.y * attentiveness };
        }
        current[index].x += (desired.x - current[index].x) * (privacyRef.current ? .3 : .14);
        current[index].y += (desired.y - current[index].y) * (privacyRef.current ? .3 : .14);
        pupil.style.transform = `translate3d(${current[index].x.toFixed(2)}px, ${current[index].y.toFixed(2)}px, 0)`;
      });
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    const blinkTimers: number[] = [];
    const scheduleBlink = (index: number) => {
      const delay = 2800 + Math.random() * 4300 + index * 140;
      blinkTimers[index] = window.setTimeout(() => {
        const eye = eyeRefs.current[index]; eye?.classList.add("blinking");
        blinkTimers[index + eyePositions.length] = window.setTimeout(() => eye?.classList.remove("blinking"), 135);
        scheduleBlink(index);
      }, delay);
    };
    eyePositions.forEach((_, index) => scheduleBlink(index));

    return () => {
      window.cancelAnimationFrame(frame); blinkTimers.forEach((timer) => window.clearTimeout(timer)); observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove); document.documentElement.removeEventListener("mouseleave", onPointerLeave); window.removeEventListener("resize", measure);
    };
  }, []);

  return <div className={cn("mascot-visual", compact && "compact")} ref={stageRef} aria-hidden="true">
    <div className="mascot-glow" /><div className="mascot-dots" />
    <div className="mascot-image-wrap"><Image src="/images/aws-mascot.png" alt="" width={1536} height={1024} priority className="mascot-image" />
      <div className="mascot-eye-layer">{eyePositions.map((position, index) => <span ref={(node) => { eyeRefs.current[index] = node; }} className={`mascot-eye mascot-eye-${position.character}`} style={{ left: `${position.left}%`, top: `${position.top}%` }} key={`${position.character}-${index}`}><span ref={(node) => { pupilRefs.current[index] = node; }} className="mascot-pupil" /></span>)}</div>
    </div>
    {!compact && <><div className="mascot-copy"><span><Sparkles size={14} /> A smarter way to process documents</span><h2>Document intelligence,<br/>with a human touch.</h2><p>Configure, inspect, and validate extraction results in one secure AWS-ready workspace.</p></div><div className="mascot-trust"><span><ShieldCheck size={14} /> Frontend demo mode</span><span><LockKeyhole size={14} /> No passwords are stored</span></div></>}
  </div>;
}
