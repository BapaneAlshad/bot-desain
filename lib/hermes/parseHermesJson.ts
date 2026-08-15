import { z } from "zod";

export function extractJsonFromText(text: string): string {
  const trimmed = text.trim();
  // Check for ```json ... ``` code fence
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    return fenceMatch[1].trim();
  }
  // Check if text starts with { or [
  const jsonObjectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    return jsonObjectMatch[0];
  }
  return trimmed;
}

export function parseAndValidateHermesJson<T>(
  rawText: string,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string; rawText: string } {
  try {
    const jsonString = extractJsonFromText(rawText);
    const parsed = JSON.parse(jsonString);
    const validationResult = schema.safeParse(parsed);

    if (validationResult.success) {
      return { success: true, data: validationResult.data };
    } else {
      const issueMessage = validationResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      return {
        success: false,
        error: `JSON Schema Validation Error: ${issueMessage}`,
        rawText,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown JSON parse error";
    return {
      success: false,
      error: `JSON Syntax Error: ${errorMsg}`,
      rawText,
    };
  }
}
