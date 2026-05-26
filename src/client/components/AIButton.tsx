import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useCredBuildAI } from "../useCredBuildAI";
import { AIPanel } from "./AIPanel";

export interface AIButtonProps {
  data: any;
  onChange: (newData: any) => void;
  config: any;
  assistantUrl?: string;
  className?: string;
}

export function AIButton({ data, onChange, config, assistantUrl = "/api/ai", className = "" }: AIButtonProps) {
  const [showPanel, setShowPanel] = useState(false);
  const { isLoading, error, sendPrompt, undo, canUndo } = useCredBuildAI({
    data,
    onChange,
    config,
    assistantUrl,
  });

  const handleGenerate = async (prompt: string, mode: "page" | "section") => {
    try {
      await sendPrompt(prompt, mode);
      // Keep panel open after generation so user can undo if they want, or close it. 
      // Closing is fine, but keeping it open or letting them undo is nice.
    } catch (e) {
      // Error handled by hook
    }
  };

  return (
    <>
      <div className={`cb-ai-button-wrapper fixed bottom-4 right-4 z-50 ${className}`}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-xs shadow-md hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 cursor-pointer border-none outline-none"
        >
          <Sparkles size={13} className="animate-pulse" />
          Bantu pakai AI
        </button>
      </div>

      {showPanel && (
        <AIPanel
          onClose={() => setShowPanel(false)}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
          onUndo={undo}
          canUndo={canUndo}
        />
      )}
    </>
  );
}
