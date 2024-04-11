import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const stream = new TransformStream();
  const streamWriter  = stream.writable.getWriter();
  const encoder = new TextEncoder();
  streamWriter.write(encoder.encode('event: wait\n'));
  streamWriter.write(encoder.encode('data: dude\n\n'));

  const hfToken = process.env.HF_API_KEY;
  // const body = await streamToString(req.body)
  const d = new URL(req.url).searchParams.get('description');

  const defaultPrompt = [
    "masterpiece",
    "high resolution",
    "light novel illustration",
    "illustration",
    "1girl",
    "beautiful",
    "cute",
    "cleavage",
    "long hair",
    "thighHighs",
    " ",
  ].join(",");
  const prompt = [defaultPrompt, d].join("");
  console.log(prompt);
  const image = await fetch(
    "https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.1",
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
      },
      method: "POST",
      body: prompt,
    }
  );
  console.debug(image.statusText);
  const blob = await image.blob();
  const imageText = await blob.arrayBuffer();
  const encoded = Buffer.from(imageText).toString("base64");
  streamWriter.write(encoder.encode('event: image\n'));
  streamWriter.write(encoder.encode('data: ' + encoded + '\n\n'));
  streamWriter.close();
  return new Response(stream.readable, {
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'Content-Encoding': 'none',
      'X-Content-Type-Options': 'nosniff',
    }
  });
  // return NextResponse.json({ image: encoded }, { status: 200 });
}
export const runtime = "edge"