import React from "react";
import { PromptPackage, BuildState } from "@/types";
import { FinalPromptCard } from "./FinalPromptCard";
import { ReferenceGuide } from "./ReferenceGuide";
import { VisionSummaryComponent } from "./VisionSummary";
import { PromptWarnings } from "./PromptWarnings";
import { ProcessingSteps } from "./ProcessingSteps";
import { Sparkles, AlertCircle, Terminal } from "lucide-react";

interface PromptResultPanelProps {
  promptPackage: PromptPackage | null;
  buildState: BuildState;
  hasReferences: boolean;
  errorMessage?: string;
  onRefineAgain?: (correctionText: string) => void;
  isRefiningAgain?: boolean;
}

export const PromptResultPanel: React.FC<PromptResultPanelProps> = ({
  promptPackage,
  buildState,
  hasReferences,
  errorMessage,
  onRefineAgain,
  isRefiningAgain,
}) => {
  const isBuilding = buildState !== "idle" && buildState !== "ready" && buildState !== "error";

  if (isBuilding) {
    return <ProcessingSteps buildState={buildState} hasReferences={hasReferences} />;
  }

  if (buildState === "error" || errorMessage) {
    return (
      <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-3 text-rose-400">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <h3 className="text-base font-bold">Prompt Building Error</h3>
        </div>
        <p className="text-xs text-rose-300/90 leading-relaxed bg-rose-950/40 p-3 rounded-xl border border-rose-500/20 font-mono">
          {errorMessage || "An unexpected error occurred while communicating with Hermes AI engine."}
        </p>
        <p className="text-xs text-slate-400">
          Tip: Verify that Hermes server is running on <code className="text-amber-400 font-mono">HERMES_BASE_URL</code> and your API key is configured correctly in <code className="text-amber-400 font-mono">.env.local</code>.
        </p>
      </div>
    );
  }

  if (!promptPackage) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="max-w-sm mx-auto space-y-1">
          <h3 className="text-sm font-bold text-slate-200">No Prompt Generated Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fill out the recruitment brief on the left, choose your target AI image platform (ChatGPT, Gemini, Meta AI), and click <strong className="text-amber-400">BUILD PROMPT WITH HERMES</strong>.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 flex items-center space-x-1">
            <Terminal className="w-3 h-3 text-amber-400" />
            <span>Hermes 2-Step Engine</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
            Platform Tailored
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
            Brand Neutral
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Final Prompt Card */}
      <FinalPromptCard
        promptPackage={promptPackage}
        onRefineAgain={onRefineAgain}
        isRefiningAgain={isRefiningAgain}
      />

      {/* 2. Reference Guide (Upload instructions per reference image) */}
      <ReferenceGuide
        referenceGuide={promptPackage.referenceGuide}
        platform={promptPackage.platform}
      />

      {/* 3. Collapsible Hermes Vision Analysis Summary */}
      {promptPackage.visionSummary && (
        <VisionSummaryComponent visionSummary={promptPackage.visionSummary} />
      )}

      {/* 4. Assumptions & Warnings Banner */}
      <PromptWarnings
        assumptions={promptPackage.assumptions}
        warnings={promptPackage.warnings}
      />
    </div>
  );
};
