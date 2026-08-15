import React from "react";
import { BuildState } from "@/types";
import { Loader2, CheckCircle2, Eye, Sparkles, SlidersHorizontal } from "lucide-react";

interface ProcessingStepsProps {
  buildState: BuildState;
  hasReferences: boolean;
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({
  buildState,
  hasReferences,
}) => {
  if (buildState === "idle" || buildState === "ready" || buildState === "error") {
    return null;
  }

  const steps = [
    { id: "validating", label: "Validating form & reference files", icon: SlidersHorizontal },
    ...(hasReferences
      ? [{ id: "analyzing_references", label: "Running Hermes Vision Inspection", icon: Eye }]
      : []),
    { id: "refining_prompt", label: "Hermes Target Prompt Optimization", icon: Sparkles },
    { id: "finalizing", label: "Generating Reference Guide & Packaging", icon: CheckCircle2 },
  ];

  const getCurrentStepIndex = () => {
    switch (buildState) {
      case "validating":
        return 0;
      case "analyzing_references":
        return hasReferences ? 1 : 0;
      case "refining_prompt":
        return hasReferences ? 2 : 1;
      case "finalizing":
        return hasReferences ? 3 : 2;
      default:
        return 0;
    }
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-center">
      <div className="flex justify-center">
        <div className="p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-100">Hermes Pipeline Processing...</h3>
        <p className="text-xs text-slate-400 mt-1">Please wait while Hermes constructs your prompt package</p>
      </div>

      <div className="space-y-3 pt-2 text-left max-w-md mx-auto">
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all flex items-center space-x-3 ${
                isDone
                  ? "bg-slate-950/60 border-slate-800 text-slate-400"
                  : isCurrent
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30"
                  : "bg-slate-950/30 border-slate-900 text-slate-600"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              ) : (
                <Icon className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="text-xs font-semibold">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
