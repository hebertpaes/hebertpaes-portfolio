import { NextRequest, NextResponse } from "next/server";
import { fetchRealtimeSources } from "@/lib/ai-suite";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const topic = String(body?.topic || "").trim();

  if (!topic) return NextResponse.json({ ok: false, error: "topic obrigatório" }, { status: 400 });

  const sources = await fetchRealtimeSources(topic);
  return NextResponse.json({ ok: true, topic, sources, fetchedAt: new Date().toISOString() });
}
