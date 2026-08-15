import React, { useState } from "react";
import { PromptPackage } from "@/types";
import { getPromptHistory, deleteHistoryItem, clearPromptHistory } from "@/lib/storage/promptHistory";
import { History, Copy, Trash2, X, Sparkles, Check } from "lucide-react";

interface PromptHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptPackage: PromptPackage) => void;
}

export const PromptHistoryModal: React.FC<PromptHistoryProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [history, setHistory] = useState<PromptPackage[]>(() => getPromptHistory());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = (id?: string) => {
    if (!id) return;
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all prompt history?")) {
      clearPromptHistory();
      setHistory([]);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Prompt History</h3>
              <p className="text-xs text-slate-400">Saved prompts built in previous sessions</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs">No prompt history found.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-400 uppercase font-mono">
                      {item.platform}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-mono">{item.aspectRatio}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id!, item.finalPrompt)}
                      className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors"
                      title="Copy Prompt"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPrompt(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-mono text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {item.finalPrompt}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
