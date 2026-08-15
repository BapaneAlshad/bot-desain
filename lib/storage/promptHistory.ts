import { PromptPackage } from "@/types";

const HISTORY_STORAGE_KEY = "job_vacancy_prompt_history_v2";
const MAX_HISTORY_ITEMS = 20;

export function getPromptHistory(): PromptPackage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to load prompt history:", err);
    return [];
  }
}

export function savePromptToHistory(promptPackage: PromptPackage): PromptPackage[] {
  if (typeof window === "undefined") return [];
  try {
    const history = getPromptHistory();
    const itemWithId: PromptPackage = {
      ...promptPackage,
      id: promptPackage.id || `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    const updated = [itemWithId, ...history.filter((h) => h.id !== itemWithId.id)].slice(
      0,
      MAX_HISTORY_ITEMS
    );
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Failed to save prompt history:", err);
    return [];
  }
}

export function deleteHistoryItem(id: string): PromptPackage[] {
  if (typeof window === "undefined") return [];
  try {
    const history = getPromptHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Failed to delete history item:", err);
    return [];
  }
}

export function clearPromptHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear prompt history:", err);
  }
}
