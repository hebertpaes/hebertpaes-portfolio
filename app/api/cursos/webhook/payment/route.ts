import { NextRequest, NextResponse } from "next/server";
import { markCheckoutPaidAndEnroll } from "@/lib/cursos-store";

type Body = {
  checkoutId?: string;
  status?: string;
};

export async function POST(req: NextRequest) {
  const secret = process.env.COURSES_WEBHOOK_SECRET;
  const sent = req.headers.get("x-webhook-secret") || "";

  if (!secret || sent !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized_webhook" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Body | null;
  const checkoutId = String(body?.checkoutId || "");
  const status = String(body?.status || "").toLowerCase();

  if (!checkoutId || !status) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (!["paid", "approved", "success"].includes(status)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const result = await markCheckoutPaidAndEnroll(checkoutId);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 404 });
  }

  return NextResponse.json({ ok: true, enrolled: true });
}
