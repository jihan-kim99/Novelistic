import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { text } from "stream/consumers";

export async function POST(req: NextApiRequest) {
  const hfToken = process.env.HF_API_KEY;
  const body = await text(req.body);
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
    "thighhighs",
    " ",
  ].join(",");
  const prompt = [defaultPrompt, ...JSON.parse(body).description].join("");
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
  return NextResponse.json({ image: encoded }, { status: 200 });
}
