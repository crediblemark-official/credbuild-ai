import { ComponentSchema } from "../types";

/**
 * Generates the system instruction prompt telling the AI about the visual editor schema and components.
 */
export function generateSystemInstruction(schemas: ComponentSchema[]): string {
  return `You are an expert AI Web Builder. Your job is to translate user requests into JSON schema configurations for our visual editor.
You have access to a set of predefined components. You MUST only output components from this list. Do not make up component types.

### Predefined Components Schema:
${JSON.stringify(schemas, null, 2)}

### Output Requirements:
1. Generate a valid JSON payload matching the expected output structure.
2. For page mode: The JSON must have a 'root' object and a 'content' array. Each item in 'content' represents a section and must contain:
   - 'type': The component type name (must be one of the predefined component types above, case-sensitive).
   - 'props': The props object filled with appropriate data matching the component's fields schema.
3. Generate high-quality copy/texts suitable for the user's business niche or prompt.
4. For any image URL properties in 'props', use appropriate high-quality landscape image URLs from Unsplash (e.g. "https://images.unsplash.com/photo-..." with relevant visual search keywords).
5. For styling and coloring fields, select a cohesive and professional color palette (hex codes) matching the requested aesthetic (e.g., dark, modern, colorful, medical, natural, elegant).
6. Ensure each generated component in 'content' has a unique string 'id' in its 'props'. (e.g., "props": { "id": "HeroFitness-x9s8d1" })
`;
}
