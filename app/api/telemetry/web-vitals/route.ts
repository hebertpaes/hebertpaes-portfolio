import { NextRequest, NextResponse } from "next/server";

type VitalBody = {
  name?: "LCP" | "CLS" | "INP" | "FCP";
  value?: number;
  id?: string;
  path?: string;
  rating?: "good" | "needs-improvement" | "poor";
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as VitalBody | null;

  if (!body?.name || typeof body?.value !== "number" || !body?.id) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Hook for future analytics provider integration.
  if (process.env.NODE_ENV !== "production") {
    console.info("[web-vitals]", body);
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
