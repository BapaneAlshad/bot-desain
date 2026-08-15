import React, { useState } from "react";
import { VisionSummary as VisionSummaryType } from "@/types/vision";
import { Eye, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from "lucide-react";

interface VisionSummaryProps {
  visionSummary?: VisionSummaryType;
}

export const VisionSummaryComponent: React.FC<VisionSummaryProps> = ({ visionSummary }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!visionSummary || !visionSummary.findings || visionSummary.findings.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-slate-900 hover:bg-slate-800/80 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Hermes Vision Analysis Summary ({visionSummary.analyzedCount} Reference Images)
            </h3>
            <p className="text-xs text-slate-400">Click to view inspected features and preserve guidelines</p>
          </div>
        </div>

        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-4">
          {visionSummary.findings.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-amber-400">{item.id}</span>
                  <span className="font-semibold text-slate-200">Role: {item.role}</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Confidence: {item.confidence}
                </span>
              </div>

              {/* Observations */}
              {item.observations.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-400">Observations:</span>
                  <ul className="list-disc list-inside text-slate-300 mt-0.5 space-y-0.5">
                    {item.observations.map((obs, i) => (
                      <li key={i}>{obs}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preserve */}
              {item.preserve.length > 0 && (
                <div>
                  <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 inline" />
                    <span>Preserve / Recreate:</span>
                  </span>
                  <ul className="list-disc list-inside text-slate-200 mt-0.5 space-y-0.5">
                    {item.preserve.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Avoid Assuming */}
              {item.avoidAssuming.length > 0 && (
                <div>
                  <span className="font-semibold text-rose-400 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 inline" />
                    <span>Do Not Assume / Ignore:</span>
                  </span>
                  <ul className="list-disc list-inside text-slate-400 mt-0.5 space-y-0.5">
                    {item.avoidAssuming.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
