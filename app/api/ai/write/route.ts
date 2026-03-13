import { NextRequest, NextResponse } from "next/server";
import { synthesizeAnswer } from "@/lib/ai-suite";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const brief = String(body?.brief || "").trim();
  const tone = String(body?.tone || "profissional");
  const model = String(body?.model || "gemini") as any;

  if (!brief) return NextResponse.json({ ok: false, error: "brief obrigatório" }, { status: 400 });

  const intro = synthesizeAnswer("write", model, brief);
  const text = `${intro}\n\nTom: ${tone}.\n\nParágrafo 1: Contexto claro e objetivo.\nParágrafo 2: Argumentação com valor prático.\nParágrafo 3: CTA de alta conversão.`;

  return NextResponse.json({ ok: true, mode: "YouWrite", model, tone, text });
}
