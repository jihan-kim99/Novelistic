interface AIResponse {
  content: string;
  notes: {
    characters?: string[];
    settings?: string[];
    plotPoints?: string[];
    style?: string;
  };
}

export function parseAIResponse(response: string): AIResponse {
  // Remove any markdown code block syntax
  const cleanedResponse = response.replace(/```json\s*|\s*```/g, "");

  try {
    const parsed = JSON.parse(cleanedResponse);
    return {
      content: parsed.content || "",
      notes: {
        characters: parsed.notes?.characters || [],
        settings: parsed.notes?.settings || [],
        plotPoints: parsed.notes?.plotPoints || [],
        style: parsed.notes?.style || "",
      },
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      content: response,
      notes: {
        characters: [],
        settings: [],
        plotPoints: [],
        style: "",
      },
    };
  }
}
