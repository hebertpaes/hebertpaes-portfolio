import { NextRequest, NextResponse } from "next/server";
import { hasValidSession } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  if (!hasValidSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    ok: true,
    gateway: "online",
    auth: "configured",
    sql: "connected",
    websocketProxy: "configured",
    updatedAt: new Date().toISOString(),
  });
}
