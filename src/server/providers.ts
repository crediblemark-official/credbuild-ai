import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateSystemInstruction } from "./promptBuilder";
import { AIResponsePage, AIResponseSection, ComponentSchema } from "../types";

export interface AIConfig {
  apiKey: string;
  provider?: "gemini" | "openai" | "openrouter" | "groq" | "nvidia";
  modelName?: string;
  baseURL?: string;
}

/**
 * Strips any markdown code block wrappers (like ```json ... ```) from LLM output before parsing.
 */
function cleanJsonText(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}

/**
 * Helper to call OpenAI-compatible API endpoints using native fetch.
 */
async function callOpenAiCompatibleApi(
  systemInstruction: string | undefined,
  chatPrompt: string,
  aiConfig: AIConfig,
  temperature = 0.7
): Promise<string> {
  const provider = aiConfig.provider || "openai";
  const apiKey = aiConfig.apiKey;

  let finalBaseUrl = aiConfig.baseURL;
  if (!finalBaseUrl) {
    if (provider === "openai") finalBaseUrl = "https://api.openai.com/v1";
    else if (provider === "openrouter") finalBaseUrl = "https://openrouter.ai/api/v1";
    else if (provider === "groq") finalBaseUrl = "https://api.groq.com/openai/v1";
    else if (provider === "nvidia") finalBaseUrl = "https://integrate.api.nvidia.com/v1";
    else finalBaseUrl = "https://api.openai.com/v1";
  }

  // Ensure trailing slash is removed before appending path
  const sanitizedBaseUrl = finalBaseUrl.replace(/\/+$/, "");

  let finalModelName = aiConfig.modelName;
  if (!finalModelName) {
    if (provider === "openai") finalModelName = "gpt-4o-mini";
    else if (provider === "openrouter") finalModelName = "google/gemini-2.5-flash";
    else if (provider === "groq") finalModelName = "llama-3.3-70b-versatile";
    else if (provider === "nvidia") finalModelName = "meta/llama-3-70b-instruct";
    else finalModelName = "gpt-4o-mini";
  }

  const messages: Array<{ role: "system" | "user"; content: string }> = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: chatPrompt });

  const response = await fetch(`${sanitizedBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: finalModelName,
      messages,
      temperature,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI Provider API request failed with status ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Empty response from AI Provider API");
  }
  return text;
}

/**
 * Creates a helper function to call the selected AI provider and generate a full page visual layout.
 */
export async function generatePageWithAI(
  userPrompt: string,
  schemas: ComponentSchema[],
  aiConfig: AIConfig,
  currentData?: any
): Promise<AIResponsePage> {
  const provider = aiConfig.provider || "gemini";
  const systemInstruction = generateSystemInstruction(schemas);

  let chatPrompt = `Generate a full landing page layout based on this user request: "${userPrompt}"`;
  
  if (currentData && typeof currentData === "object") {
    chatPrompt += `\n\nHere is the CURRENT page layout JSON state: ${JSON.stringify(currentData)}
    
    If the user's prompt asks to modify, rewrite, style, or rearrange the current page, you MUST respect this existing structure and edit it accordingly. 
    Otherwise, if they ask for a brand new page, generate a new page layout from scratch but reuse components from the schemas where appropriate.`;
  }

  chatPrompt += `\n\nThe output JSON must contain exactly this format:
{
  "root": { "props": {} },
  "content": [
    {
      "type": "ComponentName",
      "props": {
        "id": "ComponentName-uniqueId",
        ...otherProps
      }
    }
  ]
}`;

  let text: string;

  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(aiConfig.apiKey);
    const modelName = aiConfig.modelName || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
      systemInstruction,
    });

    const result = await model.generateContent(chatPrompt);
    text = result.response.text();
  } else {
    text = await callOpenAiCompatibleApi(systemInstruction, chatPrompt, aiConfig, 0.7);
  }

  const cleanedText = cleanJsonText(text);
  
  try {
    const data = JSON.parse(cleanedText);
    // Ensure IDs exist
    if (data.content && Array.isArray(data.content)) {
      data.content = data.content.map((block: any, idx: number) => {
        const id = block.props?.id || `${block.type}-${Date.now().toString(36)}-${idx}`;
        return {
          ...block,
          props: {
            ...block.props,
            id,
          },
        };
      });
    }
    return data;
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${cleanedText}`);
  }
}

/**
 * Creates a helper function to call the selected AI provider and generate a single component block.
 */
export async function generateSectionWithAI(
  userPrompt: string,
  schemas: ComponentSchema[],
  aiConfig: AIConfig,
  currentData?: any
): Promise<AIResponseSection> {
  const provider = aiConfig.provider || "gemini";
  const systemInstruction = generateSystemInstruction(schemas);

  let chatPrompt = `Generate a single component section based on this user request: "${userPrompt}"`;
  
  if (currentData && typeof currentData === "object") {
    chatPrompt += `\n\nHere is the CURRENT page layout JSON state for context: ${JSON.stringify(currentData)}`;
  }

  chatPrompt += `\n\nThe output JSON must contain exactly this format:
{
  "type": "ComponentName",
  "props": {
    "id": "ComponentName-uniqueId",
    ...otherProps
  }
}`;

  let text: string;

  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(aiConfig.apiKey);
    const modelName = aiConfig.modelName || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
      systemInstruction: `${systemInstruction}\nFor this request, you MUST generate exactly ONE component block object. Do not wrap it in a page layout structure. Just return a single component node.`,
    });

    const result = await model.generateContent(chatPrompt);
    text = result.response.text();
  } else {
    const customSystemInstruction = `${systemInstruction}\nFor this request, you MUST generate exactly ONE component block object. Do not wrap it in a page layout structure. Just return a single component node.`;
    text = await callOpenAiCompatibleApi(customSystemInstruction, chatPrompt, aiConfig, 0.7);
  }

  const cleanedText = cleanJsonText(text);

  try {
    const data = JSON.parse(cleanedText);
    if (data.props) {
      data.props.id = data.props.id || `${data.type}-${Date.now().toString(36)}`;
    }
    return data;
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${cleanedText}`);
  }
}

/**
 * Creates a helper function to refine or copywriting a specific field (text, colors, etc.) using AI.
 */
export async function refineFieldWithAI(
  userInstructions: string,
  currentValue: any,
  aiConfig: AIConfig
): Promise<any> {
  const provider = aiConfig.provider || "gemini";
  const systemInstruction = `You are an inline copywriting and styling editor assistant. 
Your task is to rewrite or modify a specific input value (such as a string, a CSS color, or an object) based on the user's instructions.
Always preserve the general structure of the input.
Return the result in this JSON format:
{
  "updatedValue": <the new value, can be a string, number, array, or object depending on what was passed in>
}`;

  const chatPrompt = `Instructions: "${userInstructions}"
Current Value: ${JSON.stringify(currentValue)}`;

  let text: string;

  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(aiConfig.apiKey);
    const modelName = aiConfig.modelName || "gemini-1.5-flash";

    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
      systemInstruction,
    });

    const result = await model.generateContent(chatPrompt);
    text = result.response.text();
  } else {
    text = await callOpenAiCompatibleApi(systemInstruction, chatPrompt, aiConfig, 0.2);
  }

  const cleanedText = cleanJsonText(text);

  try {
    const data = JSON.parse(cleanedText);
    return data.updatedValue;
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${cleanedText}`);
  }
}
