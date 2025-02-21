"use client";

import React, { createContext, useContext, useState } from "react";

import { AIContext, AIModel } from "@/types/ai";
import { generateImage as generateImageUtil } from "@/utils/generateImage";
import { Notes } from "@/types/notes";

const AIServiceContext = createContext<AIContext | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<AIModel>("gemini");
  const [apiKey, setApiKey] = useState<string>("");
  const [imageApiKey, setImageApiKey] = useState<string>("");
  const [imageEndpoint, setImageEndpoint] = useState<string>("");

  const generate = async (
    prompt: string,
    context: { content: string },
    notes?: {
      characters?: string[];
      settings?: string[];
      plotPoints?: string[];
      style?: string;
    }
  ) => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          content: context.content,
          notes,
          apiKey,
        }),
      });

      const data = await response.json();
      return data.response || "";
    } catch (error) {
      console.error("AI generation failed:", error);
      throw error;
    }
  };

  const generateImage = async (prompt: string) => {
    const result = await generateImageUtil({
      prompt,
      apiKey: imageApiKey,
      endPoint: imageEndpoint,
    });

    if (!result) {
      throw new Error("Failed to generate image");
    }

    return result.processedImage;
  };

  const summary = async (plot: string) => {
    try {
      const response = await fetch("/api/gemini/gemini-plot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plot,
          apiKey,
        }),
      });

      const data = await response.json();
      return data.response || "";
    } catch (error) {
      console.error("Plot summarization failed:", error);
      throw error;
    }
  };

  const generateImagePrompt = async (content: string, notes: Notes) => {
    try {
      const response = await fetch("/api/gemini/gemini-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          apiKey: apiKey,
          notes,
        }),
      });

      const data = await response.json();
      return data.prompt || "";
    } catch (error) {
      console.error("Image generation failed:", error);
      throw error;
    }
  };

  return (
    <AIServiceContext.Provider
      value={{
        model,
        setModel,
        apiKey,
        setApiKey,
        imageApiKey,
        setImageApiKey,
        generate,
        imageEndpoint,
        setImageEndpoint,
        generateImage,
        summary,
        generateImagePrompt,
      }}
    >
      {children}
    </AIServiceContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIServiceContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}
