import { VisionSummary } from "@/types";
import { ReferenceItem } from "@/types/references";
import { HERMES_VISION_SYSTEM_PROMPT } from "./prompts/visionSystemPrompt";
import { VisionSummarySchema } from "./schemas";
import { parseAndValidateHermesJson } from "./parseHermesJson";
import { callHermesChatCompletions, HermesMessageContentPartText, HermesMessageContentPartImage } from "./client";

export interface ReferencePayload {
  id: string; // REF-01
  role: string;
  roleDescription?: string;
  userNotes?: string;
  dataUrl: string; // base64 data URL
}

export async function analyzeReferencesWithHermes(
  references: ReferencePayload[]
): Promise<VisionSummary> {
  if (references.length === 0) {
    return { analyzedCount: 0, findings: [] };
  }

  const userContent: (HermesMessageContentPartText | HermesMessageContentPartImage)[] = [
    {
      type: "text",
      text: `Analyze the following ${references.length} reference image(s) for visual prompt engineering.
Each image has a stable ID, role, and optional user notes.
Priority Rule: User Notes override ambiguous visual inference.

Reference Images Metadata:
${references
  .map(
    (ref) =>
      `- ID: ${ref.id} | Role: ${ref.role}${
        ref.roleDescription ? ` (${ref.roleDescription})` : ""
      }${ref.userNotes ? ` | User Notes: "${ref.userNotes}"` : ""}`
  )
  .join("\n")}

Respond strictly with a JSON object conforming to the VisionSummary schema.`,
    },
  ];

  // Append images
  for (const ref of references) {
    userContent.push({
      type: "text",
      text: `[Image ${ref.id} - Role: ${ref.role}]`,
    });
    userContent.push({
      type: "image_url",
      image_url: {
        url: ref.dataUrl,
      },
    });
  }

  const firstAttempt = await callHermesChatCompletions({
    messages: [
      { role: "system", content: HERMES_VISION_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    temperature: 0.3,
  });

  const parseResult = parseAndValidateHermesJson(firstAttempt, VisionSummarySchema);

  if (parseResult.success) {
    return parseResult.data;
  }

  // Attempt 1 Repair Request
  console.warn("[Hermes Vision] First JSON parse failed. Requesting repair from Hermes...");
  const repairAttempt = await callHermesChatCompletions({
    messages: [
      { role: "system", content: HERMES_VISION_SYSTEM_PROMPT },
      { role: "user", content: userContent },
      { role: "assistant", content: firstAttempt },
      {
        role: "user",
        content: `Your previous response returned invalid JSON error: "${parseResult.error}". Please output ONLY valid JSON conforming to VisionSummary schema.`,
      },
    ],
    temperature: 0.1,
  });

  const repairResult = parseAndValidateHermesJson(repairAttempt, VisionSummarySchema);
  if (repairResult.success) {
    return repairResult.data;
  }

  throw new Error(`Hermes Vision Analysis returned invalid JSON: ${repairResult.error}`);
}
