"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 650,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);
  const previous = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      previous.current = value;
      return;
    }

    const startValue = previous.current;
    const startedAt = performance.now();
    let frame = 0;
    const completionTimer = window.setTimeout(() => {
      previous.current = value;
      setDisplay(value);
    }, duration + 50);
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(startValue + (value - startValue) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else {
        window.clearTimeout(completionTimer);
        previous.current = value;
      }
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(completionTimer); };
  }, [duration, reduceMotion, value]);

  const shown = reduceMotion ? value : display;
  return <>{prefix}{shown.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}
