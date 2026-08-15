import React, { useRef } from "react";
import { ReferenceItem, ReferenceRole } from "@/types/references";
import { APP_LIMITS } from "@/config/appLimits";
import { validateImageFile } from "@/lib/files/validateImage";
import { ReferenceImageCard } from "./ReferenceImageCard";
import { Upload, Images, AlertCircle } from "lucide-react";

interface ReferenceImagesSectionProps {
  references: ReferenceItem[];
  onChange: (updated: ReferenceItem[]) => void;
  error?: string;
}

export const ReferenceImagesSection: React.FC<ReferenceImagesSectionProps> = ({
  references,
  onChange,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = APP_LIMITS.MAX_REFERENCE_IMAGES - references.length;
    const filesToProcess = files.slice(0, remainingSlots);

    const newItems: ReferenceItem[] = [];

    filesToProcess.forEach((file, index) => {
      const valResult = validateImageFile(file, file.name);
      if (!valResult.isValid) {
        alert(valResult.error);
        return;
      }

      const idNum = references.length + newItems.length + 1;
      const refId = `REF-0${idNum}`;
      const previewUrl = URL.createObjectURL(file);

      // Guess default role based on index
      let defaultRole: ReferenceRole = "uniform";
      if (idNum === 2) defaultRole = "environment";
      if (idNum === 3) defaultRole = "model_pose";
      if (idNum === 4) defaultRole = "props_object";

      newItems.push({
        id: refId,
        file,
        previewUrl,
        role: defaultRole,
      });
    });

    if (newItems.length > 0) {
      onChange([...references, ...newItems]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdateItem = (updated: ReferenceItem) => {
    onChange(references.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleRemoveItem = (id: string) => {
    const filtered = references.filter((item) => item.id !== id);
    // Re-index stable IDs (REF-01, REF-02...)
    const reindexed = filtered.map((item, idx) => ({
      ...item,
      id: `REF-0${idx + 1}`,
    }));
    onChange(reindexed);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Images className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Reference Images (Hermes Vision)</h2>
            <p className="text-xs text-slate-400">
              Upload up to {APP_LIMITS.MAX_REFERENCE_IMAGES} images and assign roles for Hermes to inspect
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400">
          {references.length} / {APP_LIMITS.MAX_REFERENCE_IMAGES}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-2 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* List of uploaded references */}
      <div className="space-y-3">
        {references.map((item) => (
          <ReferenceImageCard
            key={item.id}
            item={item}
            onUpdate={handleUpdateItem}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>

      {/* Upload button */}
      {references.length < APP_LIMITS.MAX_REFERENCE_IMAGES && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-950/50 hover:bg-slate-900/50 p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all group"
          >
            <div className="p-2.5 rounded-full bg-slate-900 group-hover:bg-amber-500/10 text-slate-400 group-hover:text-amber-400 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                Click to add reference photo
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                JPG, PNG, WEBP (Max 5MB each)
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
