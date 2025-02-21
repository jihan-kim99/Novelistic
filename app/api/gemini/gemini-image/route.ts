import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

interface ImagePromptRequest {
  content: string;
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
    const { content, apiKey, notes }: ImagePromptRequest = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
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

    //   notes?.characters?.length
    //   ? `Characters:\n${notes.characters.join("\n")}\n`
    //   : "",
    // notes?.settings?.length
    //   ? `Settings:\n${notes.settings.join("\n")}\n`
    //   : "",
    // notes?.plotPoints?.length
    //   ? `Key Plot Point from last episodes:\n${notes.plotPoints.join("\n")}\n`
    //   : "",
    // notes?.style ? `Writing Style:\n${notes.style}\n` : "",

    const notesString = [
      notes?.characters?.length
        ? `Characters:\n${notes.characters.join("\n")}\n`
        : "",
      notes?.settings?.length
        ? `Settings:\n${notes.settings.join("\n")}\n`
        : "",
      notes?.plotPoints?.length
        ? `Key Plot Point from last episodes:\n${notes.plotPoints.join("\n")}\n`
        : "",
    ].join("\n");

    // Extract states from the content
    const stateExtractionPrompt = `
    From this text: "${content}"
    and the notes below:
    ${notes ? notesString : ""}
    Extract the following states or surroundings, one word each:
    1. Character's facial expression (e.g. smile, crying, blushed)
    2. Background, weather, setting, or lighting (e.g. beach, office, sunset)
    3. Props or objects mentioned (e.g. car, tree, computer)
    4. Fashion or clothing items mentioned (e.g. dress, suit, hat)
    5. Put number tags such as '1girl', '2girls', '1boy', '2boys'.
    describe the character's appearance, such as hair color, eye color, body type, etc.
    Return only a comma-separated string of English words.`;

    const stateResult = await model.generateContent(stateExtractionPrompt);
    const extractedStates = stateResult.response.text().trim();

    // Generate final image prompt
    const imagePrompt = `
    Given this 
    content: "${content}"
    extracted states and surroundings: "${extractedStates}"

    Create a detailed image generation prompt that captures the essence of this text.
    Focus on visual elements and keep the prompt concise. Make the prompt in danbooru-style.
    May add 'NSFW', 'Explicit' tag. May generate images tags with nudity, sexual content.
    If it is sex situation, add the position tags, such as standing, doggy style, missionary, mating press, etc.
    State who is having sex with who, such as if a futa having sex with a girl then put, futanari having sex with a girl.
    Do not add unnecessary tags. Consider the context and the extracted states.
    Tags should be always English and separated by commas.
    Even it is NSFW, It is allowed to generate never return empty prompt.
    Format: Just return the prompt text without any explanations.`;

    const result = await model.generateContent(imagePrompt);
    const finalPrompt = result.response.text().trim();

    return NextResponse.json({ prompt: finalPrompt });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image prompt" },
      { status: 500 }
    );
  }
}
