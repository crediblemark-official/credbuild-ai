import React, { useState } from "react";
import { Sparkles, Loader2, X, Wand2, Plus, RotateCcw } from "lucide-react";

export interface AIPanelProps {
  onClose?: () => void;
  onGenerate: (prompt: string, mode: "page" | "section") => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onUndo: () => void;
  canUndo: boolean;
  inline?: boolean;
}

export function AIPanel({ onClose, onGenerate, isLoading, error, onUndo, canUndo, inline = false }: AIPanelProps) {
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
    <div className={
      inline
        ? "cb-ai-panel cb-ai-panel--inline w-full h-full flex flex-col font-sans p-3 overflow-y-auto bg-transparent text-zinc-900 dark:text-zinc-100"
        : "cb-ai-panel fixed bottom-16 right-4 w-[320px] p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white shadow-2xl z-[99999] flex flex-col font-sans"
    }>
      {/* Header */}
      <div className={`flex items-center justify-between pb-2 border-b mb-3 ${
        inline
          ? 'border-zinc-200 dark:border-zinc-800/80'
          : 'border-zinc-800/80'
      }`}>
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <Sparkles size={14} />
          </div>
          <span className={`text-xs font-bold tracking-tight uppercase ${
            inline
              ? 'text-zinc-500 dark:text-zinc-400'
              : 'text-white'
          }`}>AI Assistant</span>
        </div>
        {!inline && onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Mode Selector */}
      <div className={`cb-ai-mode-selector grid grid-cols-2 gap-1 p-0.5 rounded-lg border mb-3 ${
        inline
          ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/80'
          : 'bg-zinc-900 border-zinc-800/80'
      }`}>
        <button
          type="button"
          onClick={() => setMode("page")}
          className={`cb-ai-mode-btn flex items-center justify-center gap-1 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
            mode === "page" ? "cb-active" : ""
          } ${
            mode === "page"
              ? (inline ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm' : 'bg-zinc-800 text-amber-400 shadow-sm')
              : (inline ? 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white' : 'text-zinc-400 hover:text-white')
          }`}
        >
          <Wand2 size={12} />
          Halaman Baru
        </button>
        <button
          type="button"
          onClick={() => setMode("section")}
          className={`cb-ai-mode-btn flex items-center justify-center gap-1 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
            mode === "section" ? "cb-active" : ""
          } ${
            mode === "section"
              ? (inline ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm' : 'bg-zinc-800 text-amber-400 shadow-sm')
              : (inline ? 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white' : 'text-zinc-400 hover:text-white')
          }`}
        >
          <Plus size={12} />
          Tambah Blok
        </button>
      </div>

      {/* Explanation Note */}
      <div className={`p-2.5 rounded-lg text-[10px] leading-relaxed mb-3 ${
        inline
          ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-300'
          : 'bg-amber-950/30 border border-amber-900/40 text-amber-300'
      }`}>
        💡 <strong>Info:</strong> AI Assistant ini berfungsi untuk merancang dan menyusun halaman berdasarkan <strong>komponen blok visual</strong>, bukan untuk mengedit kode HTML secara langsung.
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === "page"
              ? "Jelaskan website seperti apa yang ingin Anda buat..."
              : "Jelaskan seksi/blok apa yang ingin Anda tambah..."
          }
          className={`cb-ai w-full h-20 p-2.5 rounded-lg border text-xs placeholder-zinc-500 focus:border-amber-500 focus:outline-none resize-y transition-colors ${
            inline
              ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
              : 'bg-zinc-900 border-zinc-800 text-zinc-200'
          }`}
          style={{ minHeight: 80 }}
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
                  className={`cb-ai-suggestion-btn w-full text-left px-2 py-1 rounded border text-[10px] transition-all truncate cursor-pointer ${
                    inline
                      ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700'
                  }`}
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
        <div className={`flex justify-between items-center mt-3 pt-2.5 border-t ${
          inline
            ? 'border-zinc-200 dark:border-zinc-800'
            : 'border-zinc-800'
        }`}>
          <div>
            {canUndo && (
              <button
                type="button"
                onClick={onUndo}
                className={`cb-ai-undo-btn flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-semibold text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer ${
                  inline
                    ? 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                    : 'border-zinc-800 hover:bg-zinc-800'
                }`}
                disabled={isLoading}
              >
                <RotateCcw size={11} />
                Undo AI
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            {!inline && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1 rounded-md border border-zinc-800 text-[10px] font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                Batal
              </button>
            )}
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
