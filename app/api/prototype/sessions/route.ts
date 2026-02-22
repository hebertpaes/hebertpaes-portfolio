import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    sessions: [
      { id: "agent:codex:codex", model: "gpt-5.3-codex", status: "active", updatedAt: new Date().toISOString() },
      { id: "agent:gemini:main", model: "gemini-3-pro-preview", status: "active", updatedAt: new Date().toISOString() },
      { id: "agent:main:main", model: "claude-opus-4-6", status: "active", updatedAt: new Date().toISOString() },
    ],
  });
}
