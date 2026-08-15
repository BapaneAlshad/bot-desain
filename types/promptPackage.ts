import { TargetPlatform, OutputRatio } from "./index";
import { ReferenceGuideItem } from "./references";
import { VisionSummary } from "./vision";

export interface PromptPackage {
  id?: string;
  platform: TargetPlatform;
  finalPrompt: string;
  aspectRatio: OutputRatio;
  usedReferences: boolean;
  referenceGuide: ReferenceGuideItem[];
  visionSummary?: VisionSummary;
  assumptions: string[];
  warnings: string[];
  createdAt: string;
}

export type BuildState =
  | "idle"
  | "validating"
  | "analyzing_references"
  | "refining_prompt"
  | "finalizing"
  | "ready"
  | "error";
