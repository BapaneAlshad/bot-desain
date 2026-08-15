import { VacancyFormData } from "@/types";
import { calculateTextDensity } from "./calculateTextDensity";

export function normalizeFormData(rawData: Partial<VacancyFormData>): {
  normalized: Record<string, unknown>;
  textDensity: string;
} {
  const jobPosition = rawData.jobPosition?.trim() || "";
  const environment = rawData.environment?.trim() || "";
  const targetPlatform = rawData.targetPlatform || "chatgpt";
  const useReferenceImages = Boolean(rawData.useReferenceImages);

  const cleanString = (val?: string) => (val && val.trim() ? val.trim() : undefined);

  const normalized: Record<string, unknown> = {
    targetPlatform,
    useReferenceImages,
    jobPosition,
    gender: rawData.gender || "auto",
    ageRange: cleanString(rawData.ageRange),
    numberOfPeople: rawData.numberOfPeople || 1,
    appearanceNotes: cleanString(rawData.appearanceNotes),
    poseDescription: cleanString(rawData.poseDescription),

    environment,
    props: cleanString(rawData.props),
    additionalSceneDetails: cleanString(rawData.additionalSceneDetails),

    visualMood: cleanString(rawData.visualMood),
    imageStyle: cleanString(rawData.imageStyle),
    lighting: cleanString(rawData.lighting),
    primaryColor: cleanString(rawData.primaryColor),
    secondaryColor: cleanString(rawData.secondaryColor),
    colorDirection: cleanString(rawData.colorDirection),
    composition: cleanString(rawData.composition),
    aspectRatio: rawData.aspectRatio || "4:5",

    headline: cleanString(rawData.headline),
    location: cleanString(rawData.location),
    requirements: Array.isArray(rawData.requirements)
      ? rawData.requirements.map((r) => r.trim()).filter(Boolean)
      : [],
    cta: cleanString(rawData.cta),

    additionalInstructions: cleanString(rawData.additionalInstructions),
  };

  // Remove undefined keys
  Object.keys(normalized).forEach((key) => {
    if (normalized[key] === undefined) {
      delete normalized[key];
    }
  });

  const textDensity = calculateTextDensity(rawData);

  return {
    normalized,
    textDensity,
  };
}
