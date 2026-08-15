import { APP_LIMITS } from "@/config/appLimits";

export interface HermesMessageContentPartText {
  type: "text";
  text: string;
}

export interface HermesMessageContentPartImage {
  type: "image_url";
  image_url: {
    url: string; // Base64 data URL or HTTP URL
  };
}

export type HermesMessageContent =
  | string
  | (HermesMessageContentPartText | HermesMessageContentPartImage)[];

export interface HermesMessage {
  role: "system" | "user" | "assistant";
  content: HermesMessageContent;
}

export interface HermesChatCompletionOptions {
  messages: HermesMessage[];
  temperature?: number;
}

export class HermesClientError extends Error {
  constructor(message: string, public status?: number, public responseBody?: string) {
    super(message);
    this.name = "HermesClientError";
  }
}

export async function callHermesChatCompletions(
  options: HermesChatCompletionOptions
): Promise<string> {
  const isMockMode = process.env.HERMES_MOCK_MODE === "true";
  const baseUrl = (process.env.HERMES_BASE_URL || "http://127.0.0.1:8642/v1").replace(/\/$/, "");
  const apiKey = process.env.HERMES_API_KEY || "change-me";
  const model = process.env.HERMES_MODEL || "hermes-agent";
  const timeoutMs = Number(process.env.HERMES_REQUEST_TIMEOUT_MS) || APP_LIMITS.HERMES_TIMEOUT_MS;

  if (isMockMode) {
    console.log("[Hermes Client] HERMES_MOCK_MODE is enabled. Generating dynamic simulated response...");
    const systemPrompt = options.messages.find((m) => m.role === "system")?.content || "";
    const isVision = typeof systemPrompt === "string" && systemPrompt.includes("Vision");
    const messageStr = JSON.stringify(options.messages);

    if (isVision) {
      const refMatches = messageStr.match(/REF-\d+/g) || ["REF-01"];
      const uniqueRefs = Array.from(new Set(refMatches));

      const findings = uniqueRefs.map((id, idx) => ({
        id,
        role: (idx === 0 ? "uniform" : idx === 1 ? "environment" : "visual_style") as any,
        observations: [
          `Analyzed visual reference ${id} for key brand and subject attributes`,
          `Modern studio lighting and high-contrast color palette detected`,
          `Extracted layout structure and composition cues`
        ],
        preserve: [`Key visual styling from ${id}`, "Professional lighting atmosphere"],
        avoidAssuming: ["Unverified corporate logo details"],
        confidence: "high" as const,
        notesApplied: `Applied reference ${id} preferences to visual direction`
      }));

      return JSON.stringify({
        analyzedCount: findings.length,
        findings,
        overallNotes: `Mock Vision Analysis: Extracted visual strategy from ${findings.length} reference image(s).`
      });
    }

    // Extract text content from messages
    let textContent = "";
    for (const m of options.messages) {
      if (typeof m.content === "string") {
        textContent += m.content + "\n";
      } else if (Array.isArray(m.content)) {
        for (const p of m.content) {
          if (p.type === "text") textContent += p.text + "\n";
        }
      }
    }

    // Attempt to parse JSON payload
    let formData: Record<string, any> = {};
    const jsonMatch = textContent.match(/Normalized Visual Brief & Form Payload:\s*(\{[\s\S]*?\})\n\n/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        formData = JSON.parse(jsonMatch[1]);
      } catch {
        // Fallback if parse fails
      }
    }

    const jobTitle = formData.jobTitle || formData.roleTitle || "Job Vacancy";
    const companyName = formData.companyName || "";
    const jobPosition = formData.jobPosition || "";
    const environment = formData.environment || "";
    const description = formData.description || "";
    const visualDirection = formData.visualDirection || formData.visualStyle || "Modern Tech Corporate";
    const requirements = Array.isArray(formData.requirements)
      ? formData.requirements.join(", ")
      : formData.requirements || "";

    let platform: "chatgpt" | "gemini" | "meta" = "chatgpt";
    if (textContent.includes("(GEMINI)") || formData.targetPlatform === "gemini") platform = "gemini";
    else if (textContent.includes("(META)") || formData.targetPlatform === "meta") platform = "meta";

    const aspectRatio: any = formData.aspectRatio || "4:5";
    const hasReferences = textContent.includes("REF-01") || textContent.includes("Hermes Vision Analysis Findings");

    const promptParts: string[] = [];
    promptParts.push(`A high-impact recruitment poster for ${jobTitle}${companyName ? ` at ${companyName}` : ""}.`);

    if (jobPosition) {
      promptParts.push(`Employment type: ${jobPosition}.`);
    }

    if (visualDirection) {
      promptParts.push(`Visual style: ${visualDirection} featuring dark gradient background with vibrant accent lighting.`);
    }

    if (environment) {
      promptParts.push(`Setting & Environment: ${environment}.`);
    }

    promptParts.push(`Headline text displaying '${jobTitle.toUpperCase()}' clearly centered at the top in bold typography.`);

    if (requirements) {
      promptParts.push(`Key requirements text block: ${requirements}.`);
    } else if (description) {
      promptParts.push(`Key job summary: ${description}.`);
    }

    if (platform === "chatgpt") {
      promptParts.push("Optimized for DALL-E 3 rendering with high legibility, 8k resolution, octane studio lighting.");
    } else if (platform === "gemini") {
      promptParts.push("Designed for Imagen 3 photorealism with cinematic lighting, depth of field, and vivid color contrast.");
    } else {
      promptParts.push("Tailored for Meta AI social media visual graphics with bold typography and sleek layout hierarchy.");
    }

    const finalPrompt = promptParts.join(" ");

    return JSON.stringify({
      platform,
      finalPrompt,
      aspectRatio,
      usedReferences: hasReferences,
      referenceGuide: hasReferences
        ? [
            {
              referenceId: "REF-01",
              role: "uniform",
              uploadOrder: 1,
              instruction: `Incorporate visual style and lighting inspired by reference REF-01 for ${jobTitle}.`
            }
          ]
        : [],
      assumptions: [
        `Tailored prompt dynamically for ${jobTitle} (${platform.toUpperCase()}) based on form parameters.`
      ],
      warnings: [
        "Mock Mode active: Dynamic simulated response generated for local UI testing."
      ],
      createdAt: new Date().toISOString()
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new HermesClientError(
        `Hermes API HTTP Error ${res.status}: ${res.statusText}`,
        res.status,
        errText
      );
    }

    const rawText = await res.text();

    // 1. Attempt standard JSON response parse
    try {
      const data = JSON.parse(rawText);
      const content = data.choices?.[0]?.message?.content;
      if (content !== undefined && content !== null) {
        return typeof content === "string" ? content : JSON.stringify(content);
      }
    } catch {
      // Ignore initial JSON parse error to try SSE fallback below
    }

    // 2. Fallback parse for SSE stream responses (lines starting with 'data: ')
    const lines = rawText.split("\n").filter((l) => l.trim().startsWith("data:"));
    let accumulatedContent = "";

    for (const line of lines) {
      const jsonStr = line.replace(/^data:\s*/, "").trim();
      if (jsonStr === "[DONE]") continue;

      try {
        const parsed = JSON.parse(jsonStr);
        const chunk =
          parsed.choices?.[0]?.delta?.content ||
          parsed.choices?.[0]?.message?.content ||
          "";
        accumulatedContent += chunk;
      } catch {
        // Skip unparseable chunk lines
      }
    }

    if (accumulatedContent.trim()) {
      return accumulatedContent;
    }

    throw new HermesClientError(
      "Failed to parse content from Hermes response (neither JSON nor SSE data payload).",
      res.status,
      rawText
    );
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof HermesClientError) {
      throw err;
    }
    if (err instanceof Error && err.name === "AbortError") {
      throw new HermesClientError(`Hermes request timed out after ${timeoutMs}ms`);
    }
    const msg = err instanceof Error ? err.message : "Failed to communicate with Hermes API";
    
    if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED")) {
      throw new HermesClientError(
        `Connection failed to Hermes server at ${baseUrl}. Ensure your Hermes server is running, or set HERMES_MOCK_MODE=true in .env.local to test without an active server.`
      );
    }
    
    throw new HermesClientError(msg);
  }
}

export async function checkHermesHealth(): Promise<{ status: "connected" | "error"; message?: string }> {
  if (process.env.HERMES_MOCK_MODE === "true") {
    return { status: "connected", message: "Mock Mode Enabled" };
  }

  try {
    const baseUrl = (process.env.HERMES_BASE_URL || "http://127.0.0.1:8642/v1").replace(/\/$/, "");
    const apiKey = process.env.HERMES_API_KEY || "change-me";

    const res = await fetch(`${baseUrl}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (res.ok) {
      return { status: "connected" };
    }
    return { status: "error", message: `HTTP ${res.status}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Connection failed";
    return { status: "error", message: `${msg}. Set HERMES_MOCK_MODE=true in .env.local for local testing.` };
  }
}
