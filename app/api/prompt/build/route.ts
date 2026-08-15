import { NextRequest, NextResponse } from "next/server";
import { VacancyFormData, VisionSummary } from "@/types";
import { normalizeFormData } from "@/lib/prompt/normalizeFormData";
import { validateVacancyForm } from "@/lib/validation";
import { analyzeReferencesWithHermes, ReferencePayload } from "@/lib/hermes/analyzeReferences";
import { refinePromptWithHermes } from "@/lib/hermes/refinePrompt";
import { bufferToDataUrl } from "@/lib/files/imageToDataUrl";
import { validateImageFile } from "@/lib/files/validateImage";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let rawFormData: Partial<VacancyFormData> = {};
    const referencePayloads: ReferencePayload[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formDataReq = await req.formData();
      const formJsonString = formDataReq.get("formData");

      if (formJsonString && typeof formJsonString === "string") {
        rawFormData = JSON.parse(formJsonString);
      }

      // Extract references if enabled
      if (rawFormData.useReferenceImages) {
        let index = 0;
        while (formDataReq.has(`reference_${index}`)) {
          const file = formDataReq.get(`reference_${index}`) as File | null;
          const metaString = formDataReq.get(`reference_meta_${index}`) as string | null;

          if (file && metaString) {
            const meta = JSON.parse(metaString);

            // Validate image file
            const valResult = validateImageFile(file, file.name);
            if (!valResult.isValid) {
              return NextResponse.json({ error: valResult.error }, { status: 400 });
            }

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const dataUrl = bufferToDataUrl(buffer, file.type || "image/jpeg");

            referencePayloads.push({
              id: meta.id || `REF-0${index + 1}`,
              role: meta.role || "uniform",
              roleDescription: meta.roleDescription,
              userNotes: meta.userNotes,
              dataUrl,
            });
          }
          index++;
        }
      }
    } else {
      // Direct JSON request
      const jsonBody = await req.json();
      rawFormData = jsonBody.formData || jsonBody;
    }

    // 1. Validation
    const validation = validateVacancyForm(rawFormData, referencePayloads.map((r) => ({
      id: r.id,
      previewUrl: "",
      role: r.role as any,
      roleDescription: r.roleDescription,
      userNotes: r.userNotes,
    })));

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Form validation failed.",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // 2. Normalize Form Data & derive text density
    const { normalized, textDensity } = normalizeFormData(rawFormData);

    // 3. Hermes Vision Analysis (if references mode ON)
    let visionSummary: VisionSummary | undefined = undefined;

    if (rawFormData.useReferenceImages && referencePayloads.length > 0) {
      console.log(`[API/prompt/build] Running Hermes Vision Analysis on ${referencePayloads.length} reference(s)...`);
      try {
        visionSummary = await analyzeReferencesWithHermes(referencePayloads);
      } catch (visionErr: unknown) {
        console.error("[API/prompt/build] Vision Analysis failed:", visionErr);
        const msg = visionErr instanceof Error ? visionErr.message : "Hermes Vision analysis failed";
        return NextResponse.json(
          {
            error: `Hermes Vision Error: ${msg}. Check that Hermes active model supports vision or turn off Reference Mode to proceed without references.`,
          },
          { status: 502 }
        );
      }
    }

    // 4. Hermes Prompt Refinement
    console.log(`[API/prompt/build] Refining prompt for target platform: ${rawFormData.targetPlatform}...`);
    const promptPackage = await refinePromptWithHermes({
      targetPlatform: rawFormData.targetPlatform || "chatgpt",
      formData: normalized,
      textDensity,
      visionSummary,
      userInstructions: rawFormData.additionalInstructions,
    });

    return NextResponse.json({
      success: true,
      promptPackage,
    });
  } catch (error: unknown) {
    console.error("[API/prompt/build Error]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An internal server error occurred while building the prompt.";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
