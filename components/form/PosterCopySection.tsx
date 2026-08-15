import React from "react";
import { VacancyFormData } from "@/types";
import { RequirementsList } from "./RequirementsList";
import { Type } from "lucide-react";

interface PosterCopySectionProps {
  formData: VacancyFormData;
  onChange: (updates: Partial<VacancyFormData>) => void;
}

export const PosterCopySection: React.FC<PosterCopySectionProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Type className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">Poster Copy (Layout Context Only)</h2>
          <p className="text-xs text-amber-400/90 font-medium">
            Note: Hermes uses this text to reserve negative space and layout density. The AI generator will NOT render this text into the image.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Headline */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Headline Text</label>
          <input
            type="text"
            value={formData.headline || ""}
            onChange={(e) => onChange({ headline: e.target.value })}
            placeholder="e.g. WE'RE HIRING"
            className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="e.g. Jakarta Selatan"
            className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80"
          />
        </div>
      </div>

      {/* Requirements List */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Requirements List</label>
        <RequirementsList
          requirements={formData.requirements || []}
          onChange={(newReqs) => onChange({ requirements: newReqs })}
        />
      </div>

      {/* CTA Button Text */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Call to Action (CTA)</label>
        <input
          type="text"
          value={formData.cta || ""}
          onChange={(e) => onChange({ cta: e.target.value })}
          placeholder="e.g. APPLY NOW / SEND CV"
          className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80"
        />
      </div>
    </div>
  );
};
