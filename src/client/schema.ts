import { ComponentSchema, ComponentSchemaField } from "../types";

/**
 * Extracts a lightweight, LLM-friendly schema from a single component config.
 */
export function extractComponentSchema(componentName: string, componentConfig: any): ComponentSchema {
  const fields: Record<string, ComponentSchemaField> = {};

  const processField = (fieldKey: string, field: any): ComponentSchemaField => {
    const baseField: ComponentSchemaField = {
      type: field.type || "text",
      label: field.label || fieldKey,
    };

    if (field.description) {
      baseField.description = field.description;
    }

    if (field.options) {
      baseField.options = field.options.map((opt: any) => ({
        label: opt.label || String(opt.value),
        value: opt.value,
      }));
    }

    // Heuristics for custom fields where type: "custom" is set
    if (field.type === "custom") {
      const keyLower = fieldKey.toLowerCase();
      if (keyLower.endsWith("color")) {
        baseField.type = "color";
        baseField.description = field.description || "Hex color code string (e.g. #ffffff)";
      } else if (keyLower.endsWith("image") || keyLower.endsWith("imageurl") || keyLower.endsWith("url")) {
        baseField.type = "image_url";
        baseField.description = field.description || "High-quality image URL string";
      } else if (keyLower.endsWith("size") || keyLower.endsWith("padding") || keyLower.endsWith("gap") || keyLower.endsWith("radius") || keyLower.endsWith("height") || keyLower.endsWith("width")) {
        baseField.type = "size_or_spacing";
        baseField.description = field.description || "Size/spacing value (number/string like px or rem, or responsive object like { mobile?: number, desktop?: number })";
      }
    }

    if (field.type === "object" && field.objectFields) {
      const nestedFields: Record<string, ComponentSchemaField> = {};
      for (const [subKey, subField] of Object.entries(field.objectFields)) {
        nestedFields[subKey] = processField(subKey, subField);
      }
      baseField.objectFields = nestedFields;
    }

    return baseField;
  };

  if (componentConfig.fields) {
    for (const [fieldKey, field] of Object.entries(componentConfig.fields)) {
      fields[fieldKey] = processField(fieldKey, field);
    }
  }

  return {
    type: componentName,
    label: componentConfig.label || componentName,
    description: componentConfig.description || `${componentConfig.label || componentName} block component`,
    fields,
    defaultProps: componentConfig.defaultProps || {},
  };
}

/**
 * Converts a full visual editor config object into a serializable ComponentSchema array.
 */
export function serializeConfig(config: { components: Record<string, any> }): ComponentSchema[] {
  const schemas: ComponentSchema[] = [];
  if (!config || !config.components) return schemas;

  for (const [name, comp] of Object.entries(config.components)) {
    schemas.push(extractComponentSchema(name, comp));
  }

  return schemas;
}
