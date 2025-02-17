import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

interface PlotSummaryRequest {
  plot: string;
  apiKey: string;
}

export async function POST(request: Request) {
  try {
    const { plot, apiKey }: PlotSummaryRequest = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const constructedPrompt = [
      "# Plot Summarization Task",
      "This is for summarizing a plot while maintaining key elements.",
      "## Format Instructions",
      "- Keep the essential plot points",
      "- Maintain character relationships",
      "- Preserve major story beats",
      "- Reduce unnecessary details",
      "## Content to Summarize",
      plot,
      "\nProvide a concise summary of the above plot.",
    ]
      .filter(Boolean)
      .join("\n");

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1500,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const result = await chat.sendMessage(constructedPrompt);
    const summary = result.response.text();

    return NextResponse.json({ response: summary });
  } catch (error) {
    console.error("Error processing plot:", error);
    return NextResponse.json(
      { error: "Failed to process plot" },
      { status: 500 }
    );
  }
}
