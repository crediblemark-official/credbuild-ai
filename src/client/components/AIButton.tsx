import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useCredBuildAI } from "../useCredBuildAI";
import { AIPanel } from "./AIPanel";
import "../compiled.css";

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
    } catch (e) {
      // Error handled by hook
    }
  };

  return (
    <>
      <div className={`cb-ai-button-wrapper ${className}`}>
        <button onClick={() => setShowPanel(!showPanel)} className="cb-ai-button">
          <Sparkles size={13} className="cb-ai-pulse" />
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
