import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ text: "pong" }, { status: 200 });
}
