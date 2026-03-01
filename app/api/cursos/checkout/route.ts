import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/lib/cursos-data";

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
  const paymentUrl = `/cursos/checkout/sucesso?checkoutId=${checkoutId}&courseId=${courseId}&email=${encodeURIComponent(email)}`;

  return NextResponse.json({ ok: true, checkoutId, paymentUrl, course: { id: course.id, title: course.title, price: course.price } });
}
