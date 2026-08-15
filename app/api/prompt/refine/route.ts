import { NextRequest, NextResponse } from "next/server";
import { PromptPackage, TargetPlatform } from "@/types";
import { refinePromptWithHermes } from "@/lib/hermes/refinePrompt";

export async function POST(req: NextRequest) {
  try {
    const { existingPromptPackage, correctionInstruction, targetPlatform } = (await req.json()) as {
      existingPromptPackage: PromptPackage;
      correctionInstruction: string;
      targetPlatform?: TargetPlatform;
    };

    if (!existingPromptPackage || !correctionInstruction || !correctionInstruction.trim()) {
      return NextResponse.json(
        { error: "Previous prompt package and correction instruction are required." },
        { status: 400 }
      );
    }

    const platform = targetPlatform || existingPromptPackage.platform || "chatgpt";

    const updatedPromptPackage = await refinePromptWithHermes({
      targetPlatform: platform,
      formData: {},
      textDensity: "medium",
      visionSummary: existingPromptPackage.visionSummary,
      existingPromptPackage,
      correctionInstruction,
    });

    return NextResponse.json({
      success: true,
      promptPackage: updatedPromptPackage,
    });
  } catch (error: unknown) {
    console.error("[API/prompt/refine Error]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An internal server error occurred while refining prompt.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
