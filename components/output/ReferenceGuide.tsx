import React from "react";
import { ReferenceGuideItem } from "@/types/references";
import { TargetPlatform } from "@/types";
import { PLATFORM_PROFILES } from "@/config/platforms";
import { getRoleLabel } from "@/config/referenceRoles";
import { UploadCloud, CheckCircle2 } from "lucide-react";

interface ReferenceGuideProps {
  referenceGuide: ReferenceGuideItem[];
  platform: TargetPlatform;
}

export const ReferenceGuide: React.FC<ReferenceGuideProps> = ({
  referenceGuide,
  platform,
}) => {
  if (!referenceGuide || referenceGuide.length === 0) return null;

  const platformProfile = PLATFORM_PROFILES[platform];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">
            Reference File Upload Instructions for {platformProfile?.label || platform.toUpperCase()}
          </h3>
          <p className="text-xs text-slate-400">
            Follow these steps when attaching your reference files in {platformProfile?.label}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {referenceGuide.map((item, idx) => (
          <div
            key={item.referenceId}
            className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-start space-x-3"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {item.referenceId}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {getRoleLabel(item.role)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.instruction}</p>
            </div>

            <CheckCircle2 className="w-4 h-4 text-emerald-400/80 shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
};
