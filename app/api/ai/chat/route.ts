import { NextRequest, NextResponse } from "next/server";
import { synthesizeAnswer } from "@/lib/ai-suite";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const prompt = String(body?.prompt || "").trim();
  const model = String(body?.model || "openai") as any;

  if (!prompt) return NextResponse.json({ ok: false, error: "prompt obrigatório" }, { status: 400 });

  return NextResponse.json({
    ok: true,
    mode: "YouChat",
    model,
    reply: synthesizeAnswer("chat", model, prompt),
  });
}
