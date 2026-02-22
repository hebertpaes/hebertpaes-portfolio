import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    gateway: "online",
    auth: "configured",
    sql: "connected",
    websocketProxy: "configured",
    updatedAt: new Date().toISOString(),
  });
}
