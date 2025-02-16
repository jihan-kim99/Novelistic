interface AIResponse {
  content: string;
}

export function parseAIResponse(response: string): AIResponse {
  const cleanedResponse = response.replace(/```json\s*|\s*```/g, "");

  try {
    const parsed = JSON.parse(cleanedResponse);
    return {
      content: parsed.content || "",
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      content: response,
    };
  }
}
