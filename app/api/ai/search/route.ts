import { NextRequest, NextResponse } from "next/server";
import { fetchRealtimeSources, synthesizeAnswer } from "@/lib/ai-suite";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const query = String(body?.query || "").trim();
  const model = String(body?.model || "openai") as any;

  if (!query) return NextResponse.json({ ok: false, error: "query obrigatória" }, { status: 400 });

  const sources = await fetchRealtimeSources(query);
  const answer = synthesizeAnswer("search", model, query);

  return NextResponse.json({ ok: true, mode: "YouSearch", query, answer, sources });
}
