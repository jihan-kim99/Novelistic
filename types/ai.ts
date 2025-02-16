export type AIModel = "gemini";

export interface AIContext {
  model: AIModel;
  setModel: (model: AIModel) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  generate: (
    prompt: string,
    context: {
      content: string;
      notes: {
        characters: string[];
        settings: string[];
        plotPoints: string[];
        style: string;
      };
    }
  ) => Promise<{
    content: string;
    notes: {
      characters: string[];
      settings: string[];
      plotPoints: string[];
      style: string;
    };
  }>;
}
