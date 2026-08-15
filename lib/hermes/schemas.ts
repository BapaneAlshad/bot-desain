import { z } from "zod";

export const ReferenceRoleSchema = z.enum([
  "uniform",
  "model_pose",
  "environment",
  "props_object",
  "visual_style",
  "logo_identity",
  "other",
]);

export const VisionReferenceAnalysisSchema = z.object({
  id: z.string(),
  role: ReferenceRoleSchema,
  observations: z.array(z.string()).default([]),
  preserve: z.array(z.string()).default([]),
  avoidAssuming: z.array(z.string()).default([]),
  confidence: z.enum(["high", "medium", "low"]).default("high"),
  notesApplied: z.string().optional(),
});

export const VisionSummarySchema = z.object({
  analyzedCount: z.number().default(0),
  findings: z.array(VisionReferenceAnalysisSchema).default([]),
  overallNotes: z.string().optional(),
});

export const ReferenceGuideItemSchema = z.object({
  referenceId: z.string(),
  role: ReferenceRoleSchema,
  uploadOrder: z.number(),
  instruction: z.string(),
});

export const TargetPlatformSchema = z.enum(["chatgpt", "gemini", "meta"]);
export const OutputRatioSchema = z.enum(["1:1", "4:5", "9:16", "16:9"]);

export const PromptPackageSchema = z.object({
  platform: TargetPlatformSchema,
  finalPrompt: z.string().min(10, "Final prompt is too short"),
  aspectRatio: OutputRatioSchema.default("4:5"),
  usedReferences: z.boolean().default(false),
  referenceGuide: z.array(ReferenceGuideItemSchema).default([]),
  visionSummary: VisionSummarySchema.optional(),
  assumptions: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
});
