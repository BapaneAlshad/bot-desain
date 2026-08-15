"use client";

import React, { useState } from "react";
import { FormPreset, VacancyFormData } from "@/types";
import { Bookmark, Save, Trash2, ChevronDown } from "lucide-react";

interface PresetManagerProps {
  currentFormData: VacancyFormData;
  presets: FormPreset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: FormPreset) => void;
  onDeletePreset: (id: string) => void;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleSave = () => {
    if (!newPresetName.trim()) return;
    onSavePreset(newPresetName.trim());
    setNewPresetName("");
    setShowSaveInput(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all shadow-sm"
      >
        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
        <span>Presets ({presets.length})</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3.5 z-40 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200">Form Presets</span>
            <button
              type="button"
              onClick={() => setShowSaveInput(!showSaveInput)}
              className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <Save className="w-3 h-3" />
              <span>Save Current Brief</span>
            </button>
          </div>

          {showSaveInput && (
            <div className="flex items-center space-x-1.5 bg-slate-950 p-2 rounded-xl border border-amber-500/30">
              <input
                type="text"
                placeholder="Preset Name..."
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="flex-1 bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={handleSave}
                className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg hover:bg-amber-400 transition-colors"
              >
                Save
              </button>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto space-y-1.5">
            {presets.length === 0 ? (
              <p className="text-[11px] text-slate-500 text-center py-3">
                No saved presets.
              </p>
            ) : (
              presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 text-xs transition-colors border border-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onLoadPreset(preset);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left font-medium text-slate-200 hover:text-amber-400 truncate mr-2"
                  >
                    {preset.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeletePreset(preset.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
