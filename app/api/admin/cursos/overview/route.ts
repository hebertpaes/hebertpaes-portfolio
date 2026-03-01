import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth-guard";
import { getCursosAdminOverview } from "@/lib/cursos-store";

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = Number(req.nextUrl.searchParams.get("limit") || "20");
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(limitParam, 100)) : 20;

  try {
    const data = await getCursosAdminOverview(limit);
    return NextResponse.json({ ok: true, ...data });
  } catch {
    return NextResponse.json({ ok: true, totals: { totalCheckouts: 0, paidCheckouts: 0, pendingCheckouts: 0 }, byCourse: [], recentEnrollments: [] });
  }
}
