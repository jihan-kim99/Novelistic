import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { inputs } = await req.json();

    console.log(`inputs: ${inputs}`);

    const raw = JSON.stringify({
      key: `${process.env.MODEL_LAB_API_KEY}`,
      prompt: inputs,
      negative_prompt: "bad quality, worst quality",
      width: 1024,
      height: 1024,
      enhance_style: "anime",
    });

    // Call the Hugging Face API
    const response = await fetch(
      "https://modelslab.com/api/v6/realtime/text2img",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image from Hugging Face API" },
        { status: response.status }
      );
    }

    const data = await response.text();

    const output = JSON.parse(data);
    const imageUrl = output.output;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
