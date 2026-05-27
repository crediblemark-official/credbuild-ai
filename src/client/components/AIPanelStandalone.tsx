import React, { useCallback } from "react";
import { createUseCredBuild } from "@crediblemark/build";
import { useCredBuildAI } from "../useCredBuildAI";
import { AIPanel } from "./AIPanel";

const useCredBuild = createUseCredBuild();

export interface AIPanelStandaloneProps {
  assistantUrl?: string;
}

export function AIPanelStandalone({ assistantUrl = "/api/ai" }: AIPanelStandaloneProps) {
  const data = useCredBuild((s) => s.appState.data);
  const dispatch = useCredBuild((s) => s.dispatch);
  const config = useCredBuild((s) => s.config);

  const handleOnChange = useCallback((newData: any) => {
    dispatch({
      type: "setData",
      data: newData,
    });
  }, [dispatch]);

  const { isLoading, error, sendPrompt, undo, canUndo } = useCredBuildAI({
    data,
    onChange: handleOnChange,
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
    <AIPanel
      inline
      onGenerate={handleGenerate}
      isLoading={isLoading}
      error={error}
      onUndo={undo}
      canUndo={canUndo}
    />
  );
}
