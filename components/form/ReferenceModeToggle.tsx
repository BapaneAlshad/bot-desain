import React from "react";
import { Eye, ImageOff } from "lucide-react";

interface ReferenceModeToggleProps {
  useReferenceImages: boolean;
  onChange: (enabled: boolean) => void;
}

export const ReferenceModeToggle: React.FC<ReferenceModeToggleProps> = ({
  useReferenceImages,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-200">
        2. Reference Images Mode
      </label>
      <p className="text-xs text-slate-400">
        Choose whether you want to upload reference photos for Hermes Vision to analyze.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all ${
            !useReferenceImages
              ? "bg-slate-800/90 border-amber-500/80 ring-1 ring-amber-500/50"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
            <ImageOff className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">No Reference Images</div>
            <div className="text-xs text-slate-400">Direct prompt engineering from form brief</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all ${
            useReferenceImages
              ? "bg-slate-800/90 border-amber-500/80 ring-1 ring-amber-500/50"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">Use Reference + Hermes Vision</div>
            <div className="text-xs text-slate-400">Upload photos (uniform, pose, background)</div>
          </div>
        </button>
      </div>
    </div>
  );
};
