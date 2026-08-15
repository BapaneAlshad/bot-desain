import { FormPreset, VacancyFormData } from "@/types";

const PRESETS_STORAGE_KEY = "job_vacancy_presets_v2";

export const DEFAULT_PRESETS: FormPreset[] = [
  {
    id: "preset-barista",
    name: "Barista / Cafe Staff",
    createdAt: new Date().toISOString(),
    data: {
      jobPosition: "Barista Utama",
      environment: "Warm & cozy artisanal coffee shop with espresso machine, coffee bean jars, and ambient warm lighting.",
      props: "Portafilter, coffee cup, apron, ordering tablet.",
      visualMood: "Warm",
      imageStyle: "Commercial Photography",
      lighting: "Warm",
      aspectRatio: "4:5",
      headline: "WE ARE HIRING",
      location: "Jakarta Selatan",
      requirements: ["Min. 1 year barista experience", "Passionate about coffee", "Customer oriented"],
      cta: "Apply Now",
    },
  },
  {
    id: "preset-warehouse",
    name: "Warehouse Admin / Staff Gudang",
    createdAt: new Date().toISOString(),
    data: {
      jobPosition: "Admin Gudang",
      environment: "Clean, modern, and highly organized warehouse with inventory shelving racks and stacked shipping boxes.",
      props: "Digital barcode scanner, clipboard, inventory checklist, box package.",
      visualMood: "Professional",
      imageStyle: "Commercial Photography",
      lighting: "Bright Clean",
      aspectRatio: "4:5",
      headline: "JOIN OUR TEAM",
      location: "Tangerang",
      requirements: ["Max 27 years old", "Proficient in Microsoft Excel", "Meticulous & detail-oriented"],
      cta: "Send CV",
    },
  },
];

export function getSavedPresets(): FormPreset[] {
  if (typeof window === "undefined") return DEFAULT_PRESETS;
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return DEFAULT_PRESETS;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to load presets:", err);
    return DEFAULT_PRESETS;
  }
}

export function savePreset(name: string, data: Partial<VacancyFormData>): FormPreset[] {
  if (typeof window === "undefined") return DEFAULT_PRESETS;
  try {
    const presets = getSavedPresets();
    const newPreset: FormPreset = {
      id: `preset-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      data,
    };
    const updated = [newPreset, ...presets];
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Failed to save preset:", err);
    return DEFAULT_PRESETS;
  }
}

export function deletePreset(id: string): FormPreset[] {
  if (typeof window === "undefined") return DEFAULT_PRESETS;
  try {
    const presets = getSavedPresets();
    const updated = presets.filter((p) => p.id !== id);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Failed to delete preset:", err);
    return DEFAULT_PRESETS;
  }
}
