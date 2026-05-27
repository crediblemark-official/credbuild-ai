import React from "react";
import { Sparkles } from "lucide-react";
import { AIPanelStandalone } from "./components/AIPanelStandalone";

export * from "./useCredBuildAI";
export * from "./components/AIButton";
export * from "./components/AIPanel";
export * from "./components/AIPanelStandalone";

export const aiPlugin = (options: { assistantUrl?: string } = {}) => ({
  name: "ai",
  label: "AI Assistant",
  icon: React.createElement(Sparkles, { size: 18 }),
  render: () => React.createElement(AIPanelStandalone, { assistantUrl: options.assistantUrl }),
});
