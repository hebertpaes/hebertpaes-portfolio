import { NextRequest, NextResponse } from "next/server";
import { synthesizeAnswer } from "@/lib/ai-suite";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const prompt = String(body?.prompt || "").trim();
  const model = String(body?.model || "openai") as any;

  if (!prompt) return NextResponse.json({ ok: false, error: "prompt obrigatório" }, { status: 400 });

  const imagePrompt = `${synthesizeAnswer("imagine", model, prompt)} Style: cinematic, ultra-detailed, 8k.`;

  return NextResponse.json({
    ok: true,
    mode: "YouImagine",
    model,
    imagePrompt,
    previewUrl: `https://dummyimage.com/1024x1024/0b1220/7dd3fc&text=${encodeURIComponent("AI IMAGE PREVIEW")}`,
  });
}
