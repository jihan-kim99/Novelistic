import { NextResponse } from "next/server";
import { SchedulerType } from "@/utils/schedulerTypes";

interface RunPodInput {
  prompt: string;
  negative_prompt: string;
  height: number;
  width: number;
  num_inference_steps: number;
  guidance_scale: number;
  num_images: number;
  seed: number;
  use_lora: boolean;
  lora_scale: number;
  scheduler: SchedulerType;
}

export async function POST(req: Request) {
  try {
    const { id, ...params } = await req.json();

    if (params.apiKey === undefined) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    if (params.endPoint === undefined) {
      return NextResponse.json(
        { error: "End point is required" },
        { status: 400 }
      );
    }

    const API_KEY = params.apiKey;
    const ENDPOINT = `${params.endPoint}/run`;
    const STATUS_ENDPOINT = `${params.endPoint}/status/`;

    // If id is provided, check status
    if (id) {
      const response = await fetch(`${STATUS_ENDPOINT}${id}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      const status = await response.json();

      return NextResponse.json({
        success: true,
        status: status.status,
        imageUrl:
          status.status === "COMPLETED" ? status.output?.image_url : null,
        error: status.error,
      });
    }

    // Otherwise, start new generation
    const {
      prompt,
      negative_prompt = "Base:bad quality,worst quality,worst detail,sketch,censor,",
      height = 1024,
      width = 1360,
      num_inference_steps = 30,
      guidance_scale = 5,
      num_images = 1,
      seed = Math.floor(Math.random() * 65535),
      use_lora = false,
      lora_scale = 0,
      scheduler = SchedulerType.EULER_A,
    } = params;

    const payload = {
      input: {
        prompt: `${prompt} masterpiece,best quality,amazing quality`,
        negative_prompt,
        height,
        width,
        num_inference_steps,
        guidance_scale,
        num_images,
        seed,
        use_lora,
        lora_scale,
        scheduler,
      } satisfies RunPodInput,
    };

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      id: result.id,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
