import React from "react";
import { VacancyFormData, BuildState } from "@/types";
import { ReferenceItem } from "@/types/references";
import { GeneratorSettings } from "./GeneratorSettings";
import { ReferenceImagesSection } from "./ReferenceImagesSection";
import { JobSubjectSection } from "./JobSubjectSection";
import { EnvironmentSection } from "./EnvironmentSection";
import { VisualDirectionSection } from "./VisualDirectionSection";
import { PosterCopySection } from "./PosterCopySection";
import { Sparkles, Loader2 } from "lucide-react";

interface VacancyFormProps {
  formData: VacancyFormData;
  onFormChange: (updates: Partial<VacancyFormData>) => void;
  references: ReferenceItem[];
  onReferencesChange: (items: ReferenceItem[]) => void;
  buildState: BuildState;
  onSubmit: (e: React.FormEvent) => void;
  errors?: Record<string, string>;
}

export const VacancyForm: React.FC<VacancyFormProps> = ({
  formData,
  onFormChange,
  references,
  onReferencesChange,
  buildState,
  onSubmit,
  errors,
}) => {
  const isBuilding = buildState !== "idle" && buildState !== "ready" && buildState !== "error";

  const getButtonText = () => {
    switch (buildState) {
      case "validating":
        return "Validating brief...";
      case "analyzing_references":
        return "Analyzing reference images with Hermes Vision...";
      case "refining_prompt":
        return `Refining prompt for ${formData.targetPlatform?.toUpperCase() || "platform"}...`;
      case "finalizing":
        return "Finalizing output...";
      default:
        return "BUILD PROMPT WITH HERMES";
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* 1. Generator Settings (Platform & Reference Toggle) */}
      <GeneratorSettings
        targetPlatform={formData.targetPlatform}
        onPlatformChange={(platform) => onFormChange({ targetPlatform: platform })}
        useReferenceImages={formData.useReferenceImages}
        onReferenceToggle={(enabled) => onFormChange({ useReferenceImages: enabled })}
        errors={errors}
      />

      {/* 2. Reference Images (Only when useReferenceImages is true) */}
      {formData.useReferenceImages && (
        <ReferenceImagesSection
          references={references}
          onChange={onReferencesChange}
          error={errors?.references}
        />
      )}

      {/* 3. Job Position & Model */}
      <JobSubjectSection
        formData={formData}
        onChange={onFormChange}
        errors={errors}
      />

      {/* 4. Environment & Scene Props */}
      <EnvironmentSection
        formData={formData}
        onChange={onFormChange}
        errors={errors}
      />

      {/* 5. Visual Direction & Styling */}
      <VisualDirectionSection
        formData={formData}
        onChange={onFormChange}
      />

      {/* 6. Poster Copy Layout Context */}
      <PosterCopySection
        formData={formData}
        onChange={onFormChange}
      />

      {/* Main Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isBuilding}
          className="w-full py-4 px-6 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] shadow-xl shadow-amber-500/20 border border-amber-300/50 flex items-center justify-center space-x-3 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-base tracking-wide"
        >
          {isBuilding ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{getButtonText()}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>BUILD PROMPT WITH HERMES</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
