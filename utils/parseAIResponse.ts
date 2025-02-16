interface AIResponse {
  content: string;
  notes: {
    characters?: string[];
    settings?: string[];
    plotPoints?: string[];
    style?: string;
  };
}

function cleanAndFormatHTML(text: string): string {
  // Remove any existing HTML tags but preserve line breaks
  const cleanedText = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .trim();

  // Wrap paragraphs in proper HTML tags
  return cleanedText
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph)
    .map(
      (paragraph) =>
        `<p><span style="color: rgb(68, 68, 68); background-color: rgb(255, 255, 255);">${paragraph}</span></p>`
    )
    .join("\n");
}

export function parseAIResponse(response: string): AIResponse {
  // Remove any markdown code block syntax
  const cleanedResponse = response.replace(/```json\s*|\s*```/g, "");

  try {
    const parsed = JSON.parse(cleanedResponse);
    return {
      content: cleanAndFormatHTML(parsed.content || ""),
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
      content: cleanAndFormatHTML(response),
      notes: {
        characters: [],
        settings: [],
        plotPoints: [],
        style: "",
      },
    };
  }
}
