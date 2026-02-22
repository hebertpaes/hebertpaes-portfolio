import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    automations: [
      { name: "Deploy verification", schedule: "on push", state: "enabled" },
      { name: "Security audit", schedule: "daily 08:00", state: "enabled" },
      { name: "Heartbeat checks", schedule: "every 30m", state: "enabled" },
    ],
  });
}
