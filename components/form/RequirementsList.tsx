"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface RequirementsListProps {
  requirements: string[];
  onChange: (requirements: string[]) => void;
}

export const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([...requirements, ""]);
  };

  const handleUpdate = (index: number, val: string) => {
    const updated = [...requirements];
    updated[index] = val;
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    const updated = requirements.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-slate-200">
            11. Persyaratan / Requirements (Dynamic List)
          </label>
          <p className="text-[11px] text-slate-400">
            *Persyaratan ini akan disiapkan untuk layout poster tahap berikutnya (tidak dirender ke gambar AI).
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Item
        </button>
      </div>

      {requirements.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
          Belum ada persyaratan. Klik &quot;Tambah Item&quot; untuk menambahkan.
        </div>
      ) : (
        <div className="space-y-2">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-5 text-right">{index + 1}.</span>
              <input
                type="text"
                placeholder="Contoh: Wanita max 27 tahun / Menguasai MS Excel"
                value={req}
                onChange={(e) => handleUpdate(index, e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
