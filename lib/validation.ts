import { VacancyFormData } from "@/types";
import { ReferenceItem } from "@/types/references";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateVacancyForm(
  data: Partial<VacancyFormData>,
  references?: ReferenceItem[]
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.targetPlatform) {
    errors.targetPlatform = "Please select a target image generator platform (ChatGPT, Gemini, or Meta AI).";
  }

  if (!data.jobPosition || !data.jobPosition.trim()) {
    errors.jobPosition = "Job Position is required.";
  }

  if (!data.environment || !data.environment.trim()) {
    errors.environment = "Environment / Background description is required.";
  }

  if (data.useReferenceImages) {
    if (!references || references.length === 0) {
      errors.references = "Reference image mode is enabled. Please upload at least one reference image.";
    } else {
      references.forEach((ref, idx) => {
        if (ref.role === "other" && (!ref.roleDescription || !ref.roleDescription.trim())) {
          errors[`ref_role_${idx}`] = `Please provide a role description for reference ${ref.id}.`;
        }
      });
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
