import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth-guard";
import { getSqlPool } from "@/lib/sql";

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  let sqlOk = false;
  try {
    await getSqlPool();
    sqlOk = true;
  } catch {
    sqlOk = false;
  }

  return NextResponse.json({
    ok: true,
    auth: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
    infra: {
      sql: sqlOk,
      openclawProxy: Boolean(process.env.OPENCLAW_PROXY_TOKEN),
      upstreamWs: process.env.OPENCLAW_UPSTREAM_WS || null,
    },
    updatedAt: new Date().toISOString(),
  });
}
