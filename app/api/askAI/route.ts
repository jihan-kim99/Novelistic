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
          You have to choose one scene from the novel text and draw an illustration based on that scene.
          You have to read the novel text and choose the scene that you want to illustrate.
          You have to draw the illustration based on the scene that you have chosen.
          You have to draw the illustration in the format as below.
          When there is description of a character in the novel text, you have to draw the character in the illustration.
          the description of the scene or character that you will draw will be in the format of danbooru tags.
          at the beginning of the tags, add one and only one really short sentence about the scene or character that you will draw.
          such as "blue hair", "sword fight", "magic", "monster", "turtle monster", etc.
          You will return the Json in the format as below:
          {isImage: True, description: ""}
          `,
      },
      { role: 'user', content: prompt },
    ],
  });

  return NextResponse.json({ text: completion.choices[0] }, { status: 200 });
}
