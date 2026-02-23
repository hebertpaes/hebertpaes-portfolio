import { NextRequest, NextResponse } from "next/server";
import { hasValidSession } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  if (!hasValidSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    ok: true,
    auth: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
    infra: {
      sql: Boolean(process.env.SQL_CONNECTION_STRING),
      openclawProxy: Boolean(process.env.OPENCLAW_PROXY_TOKEN),
      upstreamWs: process.env.OPENCLAW_UPSTREAM_WS || null,
    },
    updatedAt: new Date().toISOString(),
  });
}
