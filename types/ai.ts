export type AIModel = "gemini" | "gpt-4";

export interface AIContext {
  model: AIModel;
  setModel: (model: AIModel) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  imageApiKey: string;
  setImageApiKey: (key: string) => void;
  imageEndpoint: string;
  setImageEndpoint: (endpoint: string) => void;
  generate: (prompt: string, context: { content: string }) => Promise<string>;
  generateImage: (prompt: string) => Promise<string>;
  summary: (plot: string) => Promise<string>;
}
