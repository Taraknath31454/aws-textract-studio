import { Check, Circle, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils/format";

const pipelineSteps = ["Upload", "Scan", "Extract", "Verify", "Structure"] as const;

export function PipelineIndicator({ activeIndex, complete = false, compact = false }: { activeIndex: number; complete?: boolean; compact?: boolean }) {
  return (
    <div className={cn("pipeline-indicator", compact && "pipeline-indicator-compact")} aria-label={`Document pipeline: ${complete ? "complete" : `${pipelineSteps[Math.min(activeIndex, pipelineSteps.length - 1)]} active`}`}>
      <div className="pipeline-technical-head" aria-hidden="true"><span>DOC_PIPELINE_01</span><em>{complete ? "STRUCTURED_OUTPUT: READY" : "PROCESSING_NODE: ACTIVE"}</em></div>
      <ol>
        {pipelineSteps.map((step, index) => {
          const done = complete || index < activeIndex;
          const active = !complete && index === activeIndex;
          return <li className={cn(done && "is-complete", active && "is-active")} key={step}><span>{done ? <Check size={12} /> : active ? <ScanLine size={12} /> : <Circle size={8} />}</span><strong>{step}</strong></li>;
        })}
      </ol>
    </div>
  );
}
