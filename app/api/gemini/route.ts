import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { parseAIResponse } from "@/utils/parseAIResponse";

interface NovelGenerationRequest {
  message: string;
  content?: string;
  notes?: {
    characters?: string[];
    settings?: string[];
    plotPoints?: string[];
    style?: string;
  };
  apiKey: string;
}

export async function POST(request: Request) {
  try {
    const { message, content, notes, apiKey }: NovelGenerationRequest =
      await request.json();

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
      "# Novel Writing Task",
      "## Current Context",
      content ? `Previous Content:\n${content}\n` : "",
      "## Important Notes",
      notes?.characters?.length
        ? `Characters:\n${notes.characters.join("\n")}\n`
        : "",
      notes?.settings?.length
        ? `Settings:\n${notes.settings.join("\n")}\n`
        : "",
      notes?.plotPoints?.length
        ? `Key Plot Points:\n${notes.plotPoints.join("\n")}\n`
        : "",
      notes?.style ? `Writing Style:\n${notes.style}\n` : "",
      "## Instruction",
      message,
      "\nContinue the story based on the above context and notes. Maintain consistency with the existing content and writing style.",
      "Return your response in the following JSON format:",
      "{",
      '  "content": "your generated story continuation",',
      '  "notes": {',
      '    "characters": ["list of updated or new characters"],',
      '    "settings": ["list of updated or new settings"],',
      '    "plotPoints": ["list of updated or new plot points"],',
      '    "style": "updated writing style notes"',
      "  }",
      "}",
    ]
      .filter(Boolean)
      .join("\n");

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
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
    const responseText = result.response.text();

    // Use the new parser
    const parsedResponse = parseAIResponse(responseText);
    return NextResponse.json({ response: parsedResponse });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
