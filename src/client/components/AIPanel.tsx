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
    <div className="cb-ai-panel fixed bottom-16 right-4 w-[320px] p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white shadow-2xl z-[99999] flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-400">
            <Sparkles size={14} />
          </div>
          <span className="text-xs font-bold tracking-tight">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800/80 mb-3">
        <button
          type="button"
          onClick={() => setMode("page")}
          className={`flex items-center justify-center gap-1 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
            mode === "page"
              ? "bg-zinc-800 text-amber-400 shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Wand2 size={12} />
          Halaman Baru
        </button>
        <button
          type="button"
          onClick={() => setMode("section")}
          className={`flex items-center justify-center gap-1 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
            mode === "section"
              ? "bg-zinc-800 text-amber-400 shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Plus size={12} />
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
          className="w-full h-20 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs placeholder-zinc-500 text-zinc-200 focus:border-amber-500 focus:outline-none resize-none transition-colors"
          disabled={isLoading}
        />

        {/* Suggestion Tags */}
        <div className="mt-2.5">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
            Saran Ide:
          </span>
          <div className="flex flex-col gap-1">
            {(mode === "page" ? pageSuggestions : sectionSuggestions).map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all truncate cursor-pointer"
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>

        {error && (
          <div className="mt-2.5 p-2 rounded-lg bg-red-950 border border-red-900 text-[10px] text-red-400 leading-normal">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-zinc-800">
          <div>
            {canUndo && (
              <button
                type="button"
                onClick={onUndo}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-zinc-800 text-[10px] font-semibold text-amber-500 hover:bg-zinc-850 hover:text-amber-400 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                <RotateCcw size={11} />
                Undo AI
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-md border border-zinc-800 text-[10px] font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-[10px] hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={11} />
                  Membuat...
                </>
              ) : (
                <>
                  <Sparkles size={11} />
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
