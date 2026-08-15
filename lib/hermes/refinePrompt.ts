import { PromptPackage, TargetPlatform, VisionSummary } from "@/types";
import { HERMES_REFINEMENT_SYSTEM_PROMPT } from "./prompts/refinementSystemPrompt";
import { PromptPackageSchema } from "./schemas";
import { parseAndValidateHermesJson } from "./parseHermesJson";
import { callHermesChatCompletions } from "./client";
import { PLATFORM_PROFILES } from "@/config/platforms";

export interface RefinementInputContext {
  targetPlatform: TargetPlatform;
  formData: Record<string, unknown>;
  textDensity: string;
  visionSummary?: VisionSummary;
  userInstructions?: string;
  existingPromptPackage?: PromptPackage; // For follow-up single-step refinement
  correctionInstruction?: string;
}

export async function refinePromptWithHermes(
  context: RefinementInputContext
): Promise<PromptPackage> {
  const profile = PLATFORM_PROFILES[context.targetPlatform] || PLATFORM_PROFILES.chatgpt;

  const userPromptText = `
Target Image Generator Platform: ${profile.label} (${profile.id.toUpperCase()})
Output Style Requirement: ${profile.outputStyleInstruction}
Reference Instruction Requirement: ${profile.referenceInstructionStyle}

Layout Text Density Metadata: ${context.textDensity}

Normalized Visual Brief & Form Payload:
${JSON.stringify(context.formData, null, 2)}

${
  context.visionSummary && context.visionSummary.findings.length > 0
    ? `Hermes Vision Analysis Findings (for Reference Images):
${JSON.stringify(context.visionSummary, null, 2)}`
    : "Reference Images: NONE (No Reference Mode)"
}

${
  context.correctionInstruction
    ? `USER FOLLOW-UP CORRECTION INSTRUCTION:
"${context.correctionInstruction}"
Previous Final Prompt: "${context.existingPromptPackage?.finalPrompt || ""}"
Please refine the prompt according to the correction while keeping platform format intact.`
    : ""
}

Construct a single, highly effective, self-contained prompt optimized for ${profile.label}.
Return strictly valid JSON matching the PromptPackage schema.
`.trim();

  const firstAttempt = await callHermesChatCompletions({
    messages: [
      { role: "system", content: HERMES_REFINEMENT_SYSTEM_PROMPT },
      { role: "user", content: userPromptText },
    ],
    temperature: 0.6,
  });

  const parseResult = parseAndValidateHermesJson(firstAttempt, PromptPackageSchema);

  if (parseResult.success) {
    return parseResult.data;
  }

  // Attempt 1 Repair Request
  console.warn("[Hermes Refinement] First JSON parse failed. Requesting repair from Hermes...");
  const repairAttempt = await callHermesChatCompletions({
    messages: [
      { role: "system", content: HERMES_REFINEMENT_SYSTEM_PROMPT },
      { role: "user", content: userPromptText },
      { role: "assistant", content: firstAttempt },
      {
        role: "user",
        content: `Your previous response returned invalid JSON error: "${parseResult.error}". Please output ONLY valid JSON conforming to PromptPackage schema.`,
      },
    ],
    temperature: 0.1,
  });

  const repairResult = parseAndValidateHermesJson(repairAttempt, PromptPackageSchema);
  if (repairResult.success) {
    return repairResult.data;
  }

  throw new Error(`Hermes Prompt Refinement returned invalid JSON: ${repairResult.error}`);
}
