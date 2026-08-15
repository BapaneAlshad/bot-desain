import { VacancyFormData } from "@/types";

const FORM_STATE_KEY = "job_vacancy_form_v2";

export function saveFormState(formData: VacancyFormData): void {
  if (typeof window === "undefined") return;
  try {
    // Save serializable form state without binary image objects
    const serializable = { ...formData };
    localStorage.setItem(FORM_STATE_KEY, JSON.stringify(serializable));
  } catch (err) {
    console.warn("Failed to save form state to localStorage:", err);
  }
}

export function loadFormState(): Partial<VacancyFormData> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FORM_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to load form state from localStorage:", err);
    return null;
  }
}

export function clearFormState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FORM_STATE_KEY);
  } catch (err) {
    console.warn("Failed to clear form state:", err);
  }
}
