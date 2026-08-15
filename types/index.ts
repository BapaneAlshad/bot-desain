export type TargetPlatform = "chatgpt" | "gemini" | "meta";
export type GenderOption = "male" | "female" | "auto";
export type OutputRatio = "1:1" | "4:5" | "9:16" | "16:9";

export interface VacancyFormData {
  targetPlatform: TargetPlatform;
  useReferenceImages: boolean;

  jobPosition: string;
  gender: GenderOption;
  ageRange?: string;
  numberOfPeople?: number;
  appearanceNotes?: string;
  poseDescription?: string;

  environment: string;
  props?: string;
  additionalSceneDetails?: string;

  visualMood?: string;
  imageStyle?: string;
  lighting?: string;
  primaryColor?: string;
  secondaryColor?: string;
  colorDirection?: string;
  composition?: string;
  aspectRatio: OutputRatio;

  headline?: string;
  location?: string;
  requirements: string[];
  cta?: string;

  additionalInstructions?: string;
}

export interface FormPreset {
  id: string;
  name: string;
  createdAt: string;
  data: Partial<VacancyFormData>;
}

export * from "./references";
export * from "./vision";
export * from "./promptPackage";
