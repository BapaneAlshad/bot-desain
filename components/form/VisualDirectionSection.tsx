import React from "react";
import { VacancyFormData, OutputRatio } from "@/types";
import { Palette } from "lucide-react";

interface VisualDirectionSectionProps {
  formData: VacancyFormData;
  onChange: (updates: Partial<VacancyFormData>) => void;
}

export const VisualDirectionSection: React.FC<VisualDirectionSectionProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">Visual Direction & Styling</h2>
          <p className="text-xs text-slate-400">Set visual mood, photography style, colors, composition, and aspect ratio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Visual Mood */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Visual Mood</label>
          <select
            value={formData.visualMood || "Professional"}
            onChange={(e) => onChange({ visualMood: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500/80"
          >
            <option value="Professional">Professional</option>
            <option value="Modern">Modern</option>
            <option value="Young & Energetic">Young & Energetic</option>
            <option value="Warm">Warm</option>
            <option value="Corporate">Corporate</option>
            <option value="Minimal">Minimal</option>
            <option value="Premium">Premium</option>
            <option value="Casual">Casual</option>
          </select>
        </div>

        {/* Image Style */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Photography / Art Style</label>
          <select
            value={formData.imageStyle || "Commercial Photography"}
            onChange={(e) => onChange({ imageStyle: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500/80"
          >
            <option value="Commercial Photography">Commercial Photography</option>
            <option value="Editorial Photography">Editorial Photography</option>
            <option value="Cinematic">Cinematic</option>
            <option value="Studio Portrait">Studio Portrait</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Photorealistic">Photorealistic</option>
            <option value="3D Render">3D Render</option>
          </select>
        </div>

        {/* Lighting */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Lighting Ambiance</label>
          <select
            value={formData.lighting || "Auto"}
            onChange={(e) => onChange({ lighting: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500/80"
          >
            <option value="Auto">Auto / Natural</option>
            <option value="Soft Commercial">Soft Commercial</option>
            <option value="Natural Daylight">Natural Daylight</option>
            <option value="Studio">Studio Lighting</option>
            <option value="Warm">Warm Ambiance</option>
            <option value="Bright Clean">Bright Clean</option>
          </select>
        </div>
      </div>

      {/* Color Direction */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Color Palette / Direction (Optional)
        </label>
        <input
          type="text"
          value={formData.colorDirection || ""}
          onChange={(e) => onChange({ colorDirection: e.target.value })}
          placeholder="e.g. Warm earthy brown tones with neutral cream accents..."
          className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80"
        />
      </div>

      {/* Composition & Aspect Ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Composition Layout</label>
          <select
            value={formData.composition || "Subject Left / Text Space Right"}
            onChange={(e) => onChange({ composition: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500/80"
          >
            <option value="Subject Left / Text Space Right">Subject Left / Text Space Right</option>
            <option value="Subject Right / Text Space Left">Subject Right / Text Space Left</option>
            <option value="Subject Center / Space Top">Subject Center / Space Top</option>
            <option value="Wide Negative Space">Wide Negative Space</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Output Aspect Ratio</label>
          <select
            value={formData.aspectRatio || "4:5"}
            onChange={(e) => onChange({ aspectRatio: e.target.value as OutputRatio })}
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500/80 font-mono"
          >
            <option value="4:5">4:5 (Standard IG Feed)</option>
            <option value="1:1">1:1 (Square Feed)</option>
            <option value="9:16">9:16 (Story / Reels / TikTok)</option>
            <option value="16:9">16:9 (Banner / Widescreen)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
