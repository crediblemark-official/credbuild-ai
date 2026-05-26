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

  const cssStyles = `
    .cb-ai-button-wrapper {
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 99999;
    }
    .cb-ai-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 9999px;
      background: linear-gradient(to right, #fbbf24, #f97316) !important;
      color: #000000 !important;
      font-weight: 700;
      font-size: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      border: none;
      outline: none;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .cb-ai-button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
    }
    .cb-ai-button:active {
      transform: scale(0.95);
    }
    @keyframes cb-pulse-shimmer {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.95); }
    }
    .cb-ai-pulse {
      animation: cb-pulse-shimmer 2s infinite ease-in-out;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
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
