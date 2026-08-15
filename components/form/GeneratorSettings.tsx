import React from "react";
import { TargetPlatform } from "@/types";
import { TargetPlatformSelect } from "./TargetPlatformSelect";
import { ReferenceModeToggle } from "./ReferenceModeToggle";
import { Settings } from "lucide-react";

interface GeneratorSettingsProps {
  targetPlatform: TargetPlatform;
  onPlatformChange: (platform: TargetPlatform) => void;
  useReferenceImages: boolean;
  onReferenceToggle: (enabled: boolean) => void;
  errors?: Record<string, string>;
}

export const GeneratorSettings: React.FC<GeneratorSettingsProps> = ({
  targetPlatform,
  onPlatformChange,
  useReferenceImages,
  onReferenceToggle,
  errors,
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-6">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">Generator Configuration</h2>
          <p className="text-xs text-slate-400">Specify target platform profile and reference mode</p>
        </div>
      </div>

      <TargetPlatformSelect
        selectedPlatform={targetPlatform}
        onChange={onPlatformChange}
        error={errors?.targetPlatform}
      />

      <ReferenceModeToggle
        useReferenceImages={useReferenceImages}
        onChange={onReferenceToggle}
      />
    </div>
  );
};
