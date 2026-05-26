import { useState, useCallback } from "react";
import { AIRequestPayload } from "../types";
import { serializeConfig } from "./schema";

export interface UseCredBuildAIOptions {
  data: any;
  onChange: (newData: any) => void;
  config: any;
  assistantUrl?: string;
}

export function useCredBuildAI({
  data,
  onChange,
  config,
  assistantUrl = "/api/ai",
}: UseCredBuildAIOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    onChange(previousState);
  }, [history, onChange]);

  const canUndo = history.length > 0;

  const sendPrompt = useCallback(
    async (
      prompt: string,
      mode: "page" | "section" | "refine" = "page",
      extraPayload: Partial<AIRequestPayload> & { selectedComponentId?: string } = {}
    ) => {
      setIsLoading(true);
      setError(null);

      // Save the current state to history before applying changes
      setHistory((prev) => [...prev, data]);

      try {
        const schemas = serializeConfig(config);

        const payload: AIRequestPayload & { schemas?: any } = {
          prompt,
          mode,
          currentData: data, // Send currentData in all modes for AI context
          schemas,
          ...extraPayload,
        };

        const res = await fetch(assistantUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || `Server returned ${res.status}`);
        }

        const result = await res.json();

        if (mode === "page") {
          // Replace the entire page data
          onChange(result);
        } else if (mode === "section") {
          // Contextual insertion if selectedComponentId is provided
          const currentContent = data.content || [];
          const selectedComponentId = extraPayload.selectedComponentId;

          if (selectedComponentId) {
            const selectedIdx = currentContent.findIndex(
              (block: any) => block.props?.id === selectedComponentId
            );
            if (selectedIdx !== -1) {
              const newContent = [...currentContent];
              newContent.splice(selectedIdx + 1, 0, result);
              onChange({
                ...data,
                content: newContent,
              });
              return result;
            }
          }

          // Fallback: Append the generated section to the content array
          onChange({
            ...data,
            content: [...currentContent, result],
          });
        } else if (mode === "refine") {
          // Safe nested path setting for inline refinements
          const updatedValue =
            result && typeof result === "object" && "updatedValue" in result
              ? result.updatedValue
              : result;

          if (payload.targetComponentId && payload.targetFieldPath) {
            const { targetComponentId, targetFieldPath } = payload;
            const newContent = (data.content || []).map((block: any) => {
              if (block.props?.id === targetComponentId) {
                const updatedProps = { ...block.props };

                const keys = targetFieldPath.split(".");
                let current = updatedProps;
                for (let i = 0; i < keys.length - 1; i++) {
                  const key = keys[i];
                  current[key] =
                    typeof current[key] === "object" && current[key] !== null
                      ? { ...current[key] }
                      : {};
                  current = current[key];
                }
                current[keys[keys.length - 1]] = updatedValue;

                return {
                  ...block,
                  props: updatedProps,
                };
              }
              return block;
            });

            onChange({
              ...data,
              content: newContent,
            });
          } else if (result && typeof result === "object" && result.content) {
            onChange(result);
          } else {
            console.warn("Unhandled refinement response type:", result);
          }
        }

        return result;
      } catch (err: any) {
        // Rollback history if request failed
        setHistory((prev) => prev.slice(0, -1));
        setError(err.message || "An unknown error occurred");
        console.error("useCredBuildAI error:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [data, onChange, config, assistantUrl]
  );

  return {
    isLoading,
    error,
    sendPrompt,
    undo,
    canUndo,
  };
}
