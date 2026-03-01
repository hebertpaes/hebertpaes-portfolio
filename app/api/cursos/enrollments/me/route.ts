import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth-guard";
import { getEnrollmentsByEmail, hasEnrollmentForCourse } from "@/lib/cursos-store";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session?.email) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const courseId = String(req.nextUrl.searchParams.get("courseId") || "").trim();

  try {
    if (courseId) {
      const enrolled = await hasEnrollmentForCourse(session.email, courseId);
      return NextResponse.json({ ok: true, enrolled, courseId });
    }

    const items = await getEnrollmentsByEmail(session.email);
    return NextResponse.json({ ok: true, items });
  } catch {
    return NextResponse.json({ ok: true, items: [], enrolled: false });
  }
}
