import { VacancyFormData } from "@/types";

export type TextDensity = "low" | "medium" | "high";

export function calculateTextDensity(formData: Partial<VacancyFormData>): TextDensity {
  const reqCount = formData.requirements ? formData.requirements.length : 0;
  const hasHeadline = Boolean(formData.headline && formData.headline.trim());
  const hasLocation = Boolean(formData.location && formData.location.trim());
  const hasCta = Boolean(formData.cta && formData.cta.trim());

  let score = 0;
  if (hasHeadline) score += 1;
  if (hasLocation) score += 1;
  if (hasCta) score += 1;
  score += reqCount;

  if (score <= 2) return "low";
  if (score <= 5) return "medium";
  return "high";
}
