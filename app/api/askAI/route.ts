import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

import { streamToString } from "@/utils/streamToString";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const body = await streamToString(req.body)
  const prompt = JSON.parse(body).prompt;
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
        content: `You will find only one scene that is interesting to generate in given text.
          Only one give one cut scene from the text.
          Give least 10 tags in the form of danbooru tag. For example, "blue_eyes, long_hair, school_uniform".
          If there is description of person in the text, describe that person only. Also in detailed.
          Give detailed expression on the person should be in the picture. Always add '1girl' or '1boy' tag when descibing person. 
          You will return the Json in the format as below:
          {isImage: True, description: "1girl, "}
          `,
      },
      { role: "user", content: prompt },
    ],
  });

  return NextResponse.json({ text: completion.choices[0] }, { status: 200 });
}
