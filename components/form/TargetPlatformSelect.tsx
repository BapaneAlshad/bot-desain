import React from "react";
import { TargetPlatform } from "@/types";
import { PLATFORM_PROFILES } from "@/config/platforms";
import { Sparkles, Bot, Cpu } from "lucide-react";

interface TargetPlatformSelectProps {
  selectedPlatform: TargetPlatform;
  onChange: (platform: TargetPlatform) => void;
  error?: string;
}

export const TargetPlatformSelect: React.FC<TargetPlatformSelectProps> = ({
  selectedPlatform,
  onChange,
  error,
}) => {
  const getIcon = (id: TargetPlatform) => {
    switch (id) {
      case "chatgpt":
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case "gemini":
        return <Bot className="w-5 h-5 text-blue-400" />;
      case "meta":
        return <Cpu className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-200">
        1. Target Image Generator Platform <span className="text-rose-400">*</span>
      </label>
      <p className="text-xs text-slate-400">
        Choose which AI image generator you will paste this prompt into. Hermes will tailor prompt syntax specifically for it.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {(Object.keys(PLATFORM_PROFILES) as TargetPlatform[]).map((platformId) => {
          const profile = PLATFORM_PROFILES[platformId];
          const isSelected = selectedPlatform === platformId;

          return (
            <button
              key={platformId}
              type="button"
              onClick={() => onChange(platformId)}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 relative ${
                isSelected
                  ? "bg-slate-800/90 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center space-x-2">
                  {getIcon(platformId)}
                  <span className="font-semibold text-sm text-slate-100">{profile.label}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? "border-amber-500 bg-amber-500" : "border-slate-600"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{profile.description}</p>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
};
