import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/lib/cursos-data";
import { createCheckoutRecord } from "@/lib/cursos-store";
import { createPaymentCheckout } from "@/lib/payment-gateway";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const courseId = String(body?.courseId || "");
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();

  if (!courseId || !name || !email) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return NextResponse.json({ ok: false, error: "course_not_found" }, { status: 404 });
  }

  const checkoutId = `chk_${crypto.randomUUID().slice(0, 12)}`;

  try {
    const payment = await createPaymentCheckout({
      checkoutId,
      courseId,
      courseTitle: course.title,
      name,
      email,
      priceLabel: course.price,
    });

    try {
      await createCheckoutRecord({
        checkoutId,
        courseId,
        name,
        email,
        provider: payment.provider,
        status: "pending",
        paymentUrl: payment.paymentUrl,
        paymentRef: payment.paymentRef,
      });
    } catch {
      // fallback: segue com checkout mesmo sem SQL disponível
    }

    return NextResponse.json({
      ok: true,
      checkoutId,
      paymentUrl: payment.paymentUrl,
      provider: payment.provider,
      course: { id: course.id, title: course.title, price: course.price },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "checkout_provider_error",
        message: error instanceof Error ? error.message : "Falha ao iniciar checkout",
      },
      { status: 500 }
    );
  }
}
