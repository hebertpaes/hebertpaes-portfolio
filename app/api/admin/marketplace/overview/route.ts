import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth-guard";
import { getMarketplaceAdminOverview } from "@/lib/marketplace-store";

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const data = await getMarketplaceAdminOverview();
  return NextResponse.json({ ok: true, ...data });
}
