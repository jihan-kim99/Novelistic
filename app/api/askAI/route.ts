import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

import { streamToString } from '@/utils/streamToString';

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const body = await streamToString(req.body);
  const prompt = JSON.parse(body).prompt;
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `
          You are a illustration artist. You have been given a task to draw an illustration based on the given novel text.
          You MUST read the novel text and choose the scene that you want to illustrate.
          You MUST draw one illustration based on the scene that you have chosen.
          You MUST draw the illustration in the format of tags.
          You will return in json format with the key of "isImage" and "description".
          {isImage: True, description: "tags"}
          the description of the scene or character that you will draw will be in the format of tags, comma separate string.
          NEVER use actual name of the character or scene, only use tags like 1girl, 1boy, 2girls, 2boys, 3girls, 3boys, etc.
          such as "blue hair", "sword fight", "magic", "monster", "turtle monster", etc.
          This tags always be english words.
          `,
      },
      { role: 'user', content: prompt },
    ],
  });

  return NextResponse.json({ text: completion.choices[0] }, { status: 200 });
}
