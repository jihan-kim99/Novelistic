import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { prompt } = await req.json();
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
          You are a illustration artist. You have been given a task to draw an illustration based on the given novel text.
          You MUST read the novel text and choose the scene that you want to illustrate.
          You MUST draw one illustration based on the scene that you have chosen.
          You MUST draw the illustration in the format of tags.
          You will return in json format with the key of "isImage" and "description".
          {isImage: True, description: "tags"}
          the description of the scene or character that you will draw will be in the format of tags, comma separate string.
          If it is a person, guess the ethinity and give as a tag.
          NEVER use actual name of the character, only use tags like 1girl, 1boy when there are people.
          No not describe the scene, instead use tags.
          such as "blue hair", "sword fight", "magic", "monster", "turtle monster", etc.
          This tags always be english words.
          `,
      },
      { role: "user", content: prompt },
    ],
  });

  return NextResponse.json({ text: completion.choices[0] }, { status: 200 });
}
