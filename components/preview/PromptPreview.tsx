"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, Eye } from "lucide-react";

interface PromptPreviewProps {
  prompt: string;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({ prompt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-900 hover:bg-slate-850 flex items-center justify-between text-xs font-semibold text-slate-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Lihat Live Prompt AI (Prompt Builder)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">
            {isOpen ? "Sembunyikan" : "Tampilkan"}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              Prompt yang akan/telah dikirim ke AI API:
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Tercopy!" : "Copy Prompt"}
            </button>
          </div>
          <pre className="p-3 bg-slate-900 text-slate-300 text-xs rounded-xl font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-800">
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
};
