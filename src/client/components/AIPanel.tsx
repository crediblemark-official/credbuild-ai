import React, { useState } from "react";
import { Sparkles, Loader2, X, Wand2, Plus, RotateCcw } from "lucide-react";

export interface AIPanelProps {
  onClose: () => void;
  onGenerate: (prompt: string, mode: "page" | "section") => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onUndo: () => void;
  canUndo: boolean;
}

export function AIPanel({ onClose, onGenerate, isLoading, error, onUndo, canUndo }: AIPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"page" | "section">("page");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt, mode);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const pageSuggestions = [
    "Landing page klinik gigi modern bertema bersih & profesional",
    "SaaS landing page dark mode bertema futuristik dengan tabel harga",
    "Company profile minimalis untuk biro desain arsitektur",
  ];

  const sectionSuggestions = [
    "Testimonial 3 kolom dari klien yang sangat puas",
    "Daftar harga langganan bulanan & tahunan",
    "FAQ Akordion berisi kebijakan garansi dan refund",
  ];

  return (
    <div className="cb-ai-panel fixed bottom-24 right-6 w-96 p-5 rounded-2xl bg-zinc-950/95 border border-zinc-800 text-white shadow-2xl z-50 backdrop-blur-md flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
            <Sparkles size={16} />
          </div>
          <span className="text-sm font-bold tracking-tight">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800/80 mb-4">
        <button
          type="button"
          onClick={() => setMode("page")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            mode === "page"
              ? "bg-zinc-800 text-amber-400 shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Wand2 size={13} />
          Halaman Baru
        </button>
        <button
          type="button"
          onClick={() => setMode("section")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            mode === "section"
              ? "bg-zinc-800 text-amber-400 shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Plus size={13} />
          Tambah Blok
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === "page"
              ? "Jelaskan website seperti apa yang ingin Anda buat..."
              : "Jelaskan seksi/blok apa yang ingin Anda tambahkan..."
          }
          className="w-full h-24 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs placeholder-zinc-500 text-zinc-200 focus:border-amber-500 focus:outline-none resize-none transition-colors"
          disabled={isLoading}
        />

        {/* Suggestion Tags */}
        <div className="mt-3">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
            Saran Ide:
          </span>
          <div className="flex flex-col gap-1.5">
            {(mode === "page" ? pageSuggestions : sectionSuggestions).map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-zinc-900/30 border border-zinc-800/40 text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-800/30 hover:border-zinc-700/50 transition-all truncate cursor-pointer"
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 text-[10px] text-red-400 leading-normal">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-800/80">
          <div>
            {canUndo && (
              <button
                type="button"
                onClick={onUndo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs font-semibold text-amber-500 hover:bg-zinc-900/60 hover:text-amber-400 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                <RotateCcw size={13} />
                Undo AI
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-xs hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={13} />
                  Membuat...
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
