"use client";

import React, { createContext, useContext, useState } from "react";
import { AIContext, AIModel } from "../types/ai";

const AIServiceContext = createContext<AIContext | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<AIModel>("gemini");
  const [apiKey, setApiKey] = useState<string>("");

  const generate = async (prompt: string, context: { content: string }) => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          content: context.content,
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

  return (
    <AIServiceContext.Provider
      value={{ model, setModel, apiKey, setApiKey, generate }}
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
