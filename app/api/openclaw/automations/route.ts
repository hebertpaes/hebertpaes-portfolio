import { NextRequest, NextResponse } from "next/server";
import { hasValidSession } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  if (!hasValidSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    ok: true,
    automations: [
      { name: "Deploy verification", schedule: "on push", state: "enabled" },
      { name: "Security audit", schedule: "daily 08:00", state: "enabled" },
      { name: "Heartbeat checks", schedule: "every 30m", state: "enabled" },
    ],
  });
}
