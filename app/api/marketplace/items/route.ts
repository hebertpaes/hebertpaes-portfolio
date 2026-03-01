import { NextRequest, NextResponse } from "next/server";
import { listMarketplaceItems } from "@/lib/marketplace-store";

export async function GET(req: NextRequest) {
  const type = String(req.nextUrl.searchParams.get("type") || "").trim().toLowerCase();
  const items = await listMarketplaceItems(type);
  return NextResponse.json({ ok: true, items });
}
