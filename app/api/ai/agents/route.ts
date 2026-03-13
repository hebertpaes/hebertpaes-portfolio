import { NextRequest, NextResponse } from "next/server";
import { createAgent, listAgents } from "@/lib/ai-suite";

export async function GET() {
  return NextResponse.json({ ok: true, agents: listAgents() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const systemPrompt = String(body?.systemPrompt || "").trim();
  const preferredModel = String(body?.preferredModel || "openai") as any;

  if (!name || !systemPrompt) {
    return NextResponse.json({ ok: false, error: "name e systemPrompt são obrigatórios" }, { status: 400 });
  }

  const agent = createAgent({ name, systemPrompt, preferredModel });
  return NextResponse.json({ ok: true, agent });
}
