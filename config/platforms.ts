import { TargetPlatform } from "@/types";

export interface PlatformPromptProfile {
  id: TargetPlatform;
  label: string;
  description: string;
  outputStyleInstruction: string;
  referenceInstructionStyle: string;
}

export const PLATFORM_PROFILES: Record<TargetPlatform, PlatformPromptProfile> = {
  chatgpt: {
    id: "chatgpt",
    label: "ChatGPT (DALL-E 3)",
    description: "Descriptive natural language with structured visual hierarchy and negative space guidelines.",
    outputStyleInstruction:
      "Format for ChatGPT / DALL-E 3 using rich, descriptive paragraphs with explicit subject, lighting, composition, camera style, color palette, and negative space area for text overlay. Do not use complex parameter tags.",
    referenceInstructionStyle:
      "When reference images are provided, explicitly refer to them by ID (e.g. REF-01) and describe what elements to extract (e.g. 'incorporate the shirt design from REF-01').",
  },
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    description: "Clear spatial relationships and explicit distinction between preserve vs inspire reference guidance.",
    outputStyleInstruction:
      "Format for Gemini using structured, direct visual prompts emphasizing exact scene layout, subject positioning, lighting mood, and clear boundary between background and foreground text areas.",
    referenceInstructionStyle:
      "Clearly delineate preserve vs. inspire aspects of each reference image using REF-01, REF-02 labels.",
  },
  meta: {
    id: "meta",
    label: "Meta AI",
    description: "Concise, punchy visual instructions prioritizing subject, wardrobe, lighting, and composition.",
    outputStyleInstruction:
      "Format for Meta AI using clear, direct visual prompts without fluff. Focus on subject action, uniform details, lighting ambiance, high realism, and clean negative space.",
    referenceInstructionStyle:
      "Concisely state reference role guidance (e.g., 'Model outfit based on REF-01 polo shirt design').",
  },
};
