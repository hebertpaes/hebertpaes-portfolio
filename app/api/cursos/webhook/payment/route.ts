import { NextRequest, NextResponse } from "next/server";
import { markCheckoutPaidAndEnroll } from "@/lib/cursos-store";

type Body = {
  checkoutId?: string;
  status?: string;
  type?: string;
  data?: { id?: string };
};

async function parseMercadoPago(body: Body) {
  const paymentId = body?.data?.id;
  if (!paymentId) return null;

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return null;

  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) return null;

  return {
    checkoutId: String(data.external_reference || ""),
    status: String(data.status || "").toLowerCase(),
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.COURSES_WEBHOOK_SECRET;
  const sent = req.headers.get("x-webhook-secret") || "";

  if (!secret || sent !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized_webhook" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Body | null;

  let checkoutId = String(body?.checkoutId || "");
  let status = String(body?.status || "").toLowerCase();

  if ((!checkoutId || !status) && body?.type === "payment") {
    const mp = await parseMercadoPago(body);
    if (mp) {
      checkoutId = mp.checkoutId;
      status = mp.status;
    }
  }

  if (!checkoutId || !status) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (!["paid", "approved", "success"].includes(status)) {
    return NextResponse.json({ ok: true, ignored: true, status });
  }

  const result = await markCheckoutPaidAndEnroll(checkoutId);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 404 });
  }

  return NextResponse.json({ ok: true, enrolled: true });
}
