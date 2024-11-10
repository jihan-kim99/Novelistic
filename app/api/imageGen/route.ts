import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Extract the 'inputs' from the request body
    const { inputs } = await req.json();

    console.log(`inputs: ${inputs}`);

    // Call the Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.1",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image from Hugging Face API" },
        { status: response.status }
      );
    }

    // Get the image as a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    //print out the buffer length
    console.log(buffer.length);

    // Return the image in the response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
