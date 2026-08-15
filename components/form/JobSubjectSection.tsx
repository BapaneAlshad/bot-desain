import React from "react";
import { VacancyFormData, GenderOption } from "@/types";
import { UserCheck } from "lucide-react";

interface JobSubjectSectionProps {
  formData: VacancyFormData;
  onChange: (updates: Partial<VacancyFormData>) => void;
  errors?: Record<string, string>;
}

export const JobSubjectSection: React.FC<JobSubjectSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">Job Position & Subject Model</h2>
          <p className="text-xs text-slate-400">Describe the job title and model appearance requirements</p>
        </div>
      </div>

      {/* Job Position */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Job Position <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={formData.jobPosition || ""}
          onChange={(e) => onChange({ jobPosition: e.target.value })}
          placeholder="e.g. Barista Utama, Admin Gudang, Marketing Staff..."
          className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50"
        />
        {errors?.jobPosition && <p className="text-xs text-rose-400 mt-1">{errors.jobPosition}</p>}
      </div>

      {/* Gender & Age Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Model Gender</label>
          <select
            value={formData.gender || "auto"}
            onChange={(e) => onChange({ gender: e.target.value as GenderOption })}
            className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50"
          >
            <option value="auto">Auto / No Preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Age Range (Optional)</label>
          <input
            type="text"
            value={formData.ageRange || ""}
            onChange={(e) => onChange({ ageRange: e.target.value })}
            placeholder="e.g. 20-27"
            className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Model Appearance Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Model Appearance Notes (Optional)
        </label>
        <textarea
          rows={2}
          value={formData.appearanceNotes || ""}
          onChange={(e) => onChange({ appearanceNotes: e.target.value })}
          placeholder="e.g. Young Indonesian professional, friendly smile, neat hairstyle..."
          className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 resize-none"
        />
      </div>

      {/* Pose Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Pose / Action Description (Optional)
        </label>
        <textarea
          rows={2}
          value={formData.poseDescription || ""}
          onChange={(e) => onChange({ poseDescription: e.target.value })}
          placeholder="e.g. Standing confidently holding a digital tablet and gesturing toward coffee machine..."
          className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 resize-none"
        />
      </div>
    </div>
  );
};
