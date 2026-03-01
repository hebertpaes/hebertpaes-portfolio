import { NextRequest, NextResponse } from "next/server";
import { markCheckoutPaidAndEnroll } from "@/lib/cursos-store";

export async function POST(req: NextRequest) {
  const provider = (process.env.COURSES_PAYMENT_PROVIDER || "mock").toLowerCase();
  if (provider !== "mock") {
    return NextResponse.json({ ok: false, error: "manual_confirm_disabled" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const checkoutId = String(body?.checkoutId || "");

  if (!checkoutId) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const result = await markCheckoutPaidAndEnroll(checkoutId);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 404 });
  }

  return NextResponse.json({ ok: true, enrolled: true });
}
