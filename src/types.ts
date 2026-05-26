export interface ComponentSchemaField {
  type: string;
  label: string;
  description?: string;
  options?: Array<{ label: string; value: any }>;
  objectFields?: Record<string, ComponentSchemaField>;
}

export interface ComponentSchema {
  type: string;
  label: string;
  description?: string;
  category?: string;
  fields: Record<string, ComponentSchemaField>;
  defaultProps?: Record<string, any>;
}

export interface AIRequestPayload {
  prompt: string;
  mode: "page" | "section" | "refine";
  currentData?: any;
  targetComponentId?: string;
  targetFieldPath?: string;
}

export interface AIResponsePage {
  root: {
    props?: Record<string, any>;
  };
  content: Array<{
    type: string;
    props: Record<string, any> & { id: string };
  }>;
  zones?: Record<string, Array<{
    type: string;
    props: Record<string, any> & { id: string };
  }>>;
}

export interface AIResponseSection {
  type: string;
  props: Record<string, any> & { id: string };
}

export interface AIResponseRefine {
  updatedValue: any;
}
