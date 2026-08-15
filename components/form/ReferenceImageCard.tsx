import React from "react";
import { ReferenceItem, ReferenceRole } from "@/types/references";
import { REFERENCE_ROLE_OPTIONS } from "@/config/referenceRoles";
import { Trash2, Image as ImageIcon } from "lucide-react";

interface ReferenceImageCardProps {
  item: ReferenceItem;
  onUpdate: (updated: ReferenceItem) => void;
  onRemove: (id: string) => void;
}

export const ReferenceImageCard: React.FC<ReferenceImageCardProps> = ({
  item,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row gap-3.5 items-start relative group">
      {/* Thumbnail */}
      <div className="w-full sm:w-28 h-28 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center shrink-0 relative">
        {item.previewUrl ? (
          <img
            src={item.previewUrl}
            alt={item.id}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-700" />
        )}
        <div className="absolute top-1.5 left-1.5 bg-slate-950/90 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
          {item.id}
        </div>
      </div>

      {/* Inputs */}
      <div className="flex-1 w-full space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200">
            Reference Role <span className="text-rose-400">*</span>
          </label>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
            title="Remove image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <select
          value={item.role}
          onChange={(e) => onUpdate({ ...item, role: e.target.value as ReferenceRole })}
          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500/80"
        >
          {REFERENCE_ROLE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>

        {item.role === "other" && (
          <input
            type="text"
            value={item.roleDescription || ""}
            onChange={(e) => onUpdate({ ...item, roleDescription: e.target.value })}
            placeholder="Describe role for this reference..."
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80"
          />
        )}

        <textarea
          rows={2}
          value={item.userNotes || ""}
          onChange={(e) => onUpdate({ ...item, userNotes: e.target.value })}
          placeholder="User Notes (Priority Intent): e.g. Follow shirt shape & color, ignore face..."
          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 resize-none"
        />
      </div>
    </div>
  );
};
