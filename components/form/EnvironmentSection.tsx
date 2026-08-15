import React from "react";
import { VacancyFormData } from "@/types";
import { Building2 } from "lucide-react";

interface EnvironmentSectionProps {
  formData: VacancyFormData;
  onChange: (updates: Partial<VacancyFormData>) => void;
  errors?: Record<string, string>;
}

export const EnvironmentSection: React.FC<EnvironmentSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">Environment & Scene Props</h2>
          <p className="text-xs text-slate-400">Describe the background setting and featured items</p>
        </div>
      </div>

      {/* Environment Background */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Environment / Background <span className="text-rose-400">*</span>
        </label>
        <textarea
          rows={3}
          value={formData.environment || ""}
          onChange={(e) => onChange({ environment: e.target.value })}
          placeholder="e.g. Modern wooden cafe interior with warm lighting, espresso machine in soft background blur..."
          className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 resize-none"
        />
        {errors?.environment && <p className="text-xs text-rose-400 mt-1">{errors.environment}</p>}
      </div>

      {/* Supporting Props */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Supporting Props (Optional)
        </label>
        <textarea
          rows={2}
          value={formData.props || ""}
          onChange={(e) => onChange({ props: e.target.value })}
          placeholder="e.g. Coffee cup, portafilter, apron, ordering tablet..."
          className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 resize-none"
        />
      </div>

      {/* Additional Scene Details */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Additional Scene Details (Optional)
        </label>
        <input
          type="text"
          value={formData.additionalSceneDetails || ""}
          onChange={(e) => onChange({ additionalSceneDetails: e.target.value })}
          placeholder="e.g. Morning sunlight streaming through large glass windows..."
          className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50"
        />
      </div>
    </div>
  );
};
