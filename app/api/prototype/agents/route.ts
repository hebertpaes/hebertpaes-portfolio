import { NextRequest, NextResponse } from "next/server";
import { hasValidSession } from "@/lib/auth-guard";

const AGENTS = [
  { id: "codex", name: "Codex Agent", model: "gpt-5.3-codex", status: "online" },
  { id: "main", name: "Main Agent", model: "claude-opus-4-6", status: "online" },
  { id: "gemini", name: "Gemini Agent", model: "gemini-3-pro-preview", status: "online" },
];

export async function GET(req: NextRequest) {
  if (!hasValidSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, agents: AGENTS, updatedAt: new Date().toISOString() });
}

export async function POST(req: NextRequest) {
  if (!hasValidSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const agentId = String(body.agentId || "");
  const prompt = String(body.prompt || "");
  const agent = AGENTS.find((a) => a.id === agentId);

  if (!agent) return NextResponse.json({ ok: false, error: "Agent not found" }, { status: 404 });
  if (!prompt) return NextResponse.json({ ok: false, error: "Prompt obrigatório" }, { status: 400 });

  return NextResponse.json({
    ok: true,
    agent: agent.name,
    response: `[PROTÓTIPO] ${agent.name} executou: "${prompt}" com ${agent.model}`,
    at: new Date().toISOString(),
  });
}
