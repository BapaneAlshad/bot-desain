"use client";

import React, { useState, useEffect } from "react";
import { VacancyFormData, PromptPackage, BuildState, FormPreset } from "@/types";
import { ReferenceItem } from "@/types/references";
import { VacancyForm } from "@/components/form/VacancyForm";
import { PromptResultPanel } from "@/components/output/PromptResultPanel";
import { PromptHistoryModal } from "@/components/history/PromptHistory";
import { PresetManager } from "@/components/presets/PresetManager";
import { saveFormState, loadFormState } from "@/lib/storage/formState";
import { savePromptToHistory } from "@/lib/storage/promptHistory";
import { getSavedPresets, savePreset, deletePreset } from "@/lib/storage/presets";
import { Sparkles, History, Bot, CheckCircle2 } from "lucide-react";

const INITIAL_FORM_DATA: VacancyFormData = {
  targetPlatform: "chatgpt",
  useReferenceImages: false,
  jobPosition: "Barista Utama",
  gender: "auto",
  ageRange: "20-27 tahun",
  appearanceNotes: "Stylishly dressed, warm approachable expression",
  poseDescription: "Standing behind wooden counter holding espresso portafilter",

  environment: "Warm, cozy artisanal coffee shop with espresso machine, coffee bean jars, and ambient warm lighting",
  props: "Portafilter, ceramic coffee cup, apron, ordering tablet",
  additionalSceneDetails: "Soft morning daylight streaming through large glass windows",

  visualMood: "Warm",
  imageStyle: "Commercial Photography",
  lighting: "Warm",
  colorDirection: "Warm earthy brown tones with cream accents",
  composition: "Subject Left / Text Space Right",
  aspectRatio: "4:5",

  headline: "WE ARE HIRING",
  location: "Jakarta Selatan",
  requirements: [
    "Min. 1 tahun pengalaman barista",
    "Jujur, disiplin, dan komunikatif",
    "Passionate terhadap kopi & pelayanan",
  ],
  cta: "APPLY NOW / SEND CV",
};

export default function Home() {
  const [formData, setFormData] = useState<VacancyFormData>(INITIAL_FORM_DATA);
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [buildState, setBuildState] = useState<BuildState>("idle");
  const [promptPackage, setPromptPackage] = useState<PromptPackage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // History & Presets
  const [presets, setPresets] = useState<FormPreset[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRefiningAgain, setIsRefiningAgain] = useState(false);

  // Health check state
  const [hermesStatus, setHermesStatus] = useState<"checking" | "connected" | "error">("checking");

  // Load saved state on mount
  useEffect(() => {
    const savedForm = loadFormState();
    if (savedForm) {
      setFormData((prev) => ({ ...prev, ...savedForm }));
    }
    setPresets(getSavedPresets());

    // Health check call
    fetch("/api/hermes/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "connected") {
          setHermesStatus("connected");
        } else {
          setHermesStatus("error");
        }
      })
      .catch(() => setHermesStatus("error"));
  }, []);

  // Form updates
  const handleFormChange = (updates: Partial<VacancyFormData>) => {
    const updated = { ...formData, ...updates };
    setFormData(updated);
    setErrors({});
    saveFormState(updated);
  };

  // Main Submit Handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setErrorMessage("");
    setErrors({});

    // Client validation
    if (!formData.jobPosition || !formData.jobPosition.trim()) {
      setErrors({ jobPosition: "Job position is required" });
      return;
    }
    if (!formData.environment || !formData.environment.trim()) {
      setErrors({ environment: "Environment / Background is required" });
      return;
    }
    if (formData.useReferenceImages && references.length === 0) {
      setErrors({ references: "Reference mode is enabled. Please upload at least 1 image." });
      return;
    }

    setBuildState("validating");

    try {
      const payloadData = new FormData();
      payloadData.append("formData", JSON.stringify(formData));

      if (formData.useReferenceImages) {
        references.forEach((ref, idx) => {
          if (ref.file) {
            payloadData.append(`reference_${idx}`, ref.file);
            payloadData.append(
              `reference_meta_${idx}`,
              JSON.stringify({
                id: ref.id,
                role: ref.role,
                roleDescription: ref.roleDescription,
                userNotes: ref.userNotes,
              })
            );
          }
        });
        setBuildState("analyzing_references");
      } else {
        setBuildState("refining_prompt");
      }

      const res = await fetch("/api/prompt/build", {
        method: "POST",
        body: payloadData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to build prompt package with Hermes.");
      }

      setBuildState("finalizing");
      const resultPackage: PromptPackage = data.promptPackage;

      setPromptPackage(resultPackage);
      setBuildState("ready");
      savePromptToHistory(resultPackage);
    } catch (err: unknown) {
      console.error("[Home submit error]:", err);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      setBuildState("error");
    }
  };

  // Follow-up single-step refinement
  const handleRefineAgain = async (correctionInstruction: string) => {
    if (!promptPackage || !correctionInstruction.trim()) return;

    setIsRefiningAgain(true);
    try {
      const res = await fetch("/api/prompt/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existingPromptPackage: promptPackage,
          correctionInstruction,
          targetPlatform: formData.targetPlatform,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to refine prompt.");
      }

      setPromptPackage(data.promptPackage);
      savePromptToHistory(data.promptPackage);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to refine prompt.");
    } finally {
      setIsRefiningAgain(false);
    }
  };

  // Presets Handlers
  const handleSavePreset = (name: string) => {
    const updated = savePreset(name, formData);
    setPresets(updated);
  };

  const handleLoadPreset = (preset: FormPreset) => {
    if (preset.data) {
      const merged = { ...formData, ...preset.data };
      setFormData(merged);
      saveFormState(merged);
    }
  };

  const handleDeletePreset = (id: string) => {
    const updated = deletePreset(id);
    setPresets(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* HEADER BAR */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center space-x-2 leading-tight">
              <span>Job Vacancy Prompt Builder</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                V2 Hermes Agent
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Brand-neutral recruitment visual brief generator with Hermes Vision & Prompt Refinement
            </p>
          </div>
        </div>

        {/* RIGHT TOP ACTIONS */}
        <div className="flex items-center space-x-2.5">
          {/* Hermes Health Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
            <Bot className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Hermes:</span>
            {hermesStatus === "connected" ? (
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Ready</span>
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">Local (8642)</span>
            )}
          </div>

          <PresetManager
            currentFormData={formData}
            presets={presets}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
          />

          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Prompt History</span>
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FORM BRIEF (7 cols) */}
          <div className="lg:col-span-7">
            <VacancyForm
              formData={formData}
              onFormChange={handleFormChange}
              references={references}
              onReferencesChange={setReferences}
              buildState={buildState}
              onSubmit={handleSubmit}
              errors={errors}
            />
          </div>

          {/* RIGHT COLUMN: STICKY RESULT PANEL (5 cols) */}
          <div className="lg:col-span-5 sticky top-20">
            <PromptResultPanel
              promptPackage={promptPackage}
              buildState={buildState}
              hasReferences={formData.useReferenceImages}
              errorMessage={errorMessage}
              onRefineAgain={handleRefineAgain}
              isRefiningAgain={isRefiningAgain}
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        Job Vacancy Prompt Builder V2 &copy; {new Date().getFullYear()} — Powered by Hermes AI Agent Engine.
      </footer>

      {/* HISTORY MODAL */}
      <PromptHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectPrompt={(selectedPkg) => setPromptPackage(selectedPkg)}
      />
    </div>
  );
}
