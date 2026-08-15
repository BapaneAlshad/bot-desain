import React from "react";
import { AlertTriangle, Info } from "lucide-react";

interface PromptWarningsProps {
  assumptions: string[];
  warnings: string[];
}

export const PromptWarnings: React.FC<PromptWarningsProps> = ({ assumptions, warnings }) => {
  if (assumptions.length === 0 && warnings.length === 0) return null;

  return (
    <div className="space-y-2">
      {warnings.length > 0 && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-xs text-amber-300">
          <div className="flex items-center space-x-2 font-semibold text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Prompt Engineering Warnings:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {assumptions.length > 0 && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1 text-xs text-blue-300">
          <div className="flex items-center space-x-2 font-semibold text-blue-400">
            <Info className="w-4 h-4 shrink-0" />
            <span>Design Assumptions Made by Hermes:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            {assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
