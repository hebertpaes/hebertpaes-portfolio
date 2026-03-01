import { NextRequest, NextResponse } from "next/server";
import { createMarketplaceOrder, listMarketplaceItems } from "@/lib/marketplace-store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const itemId = String(body?.itemId || "").trim();
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const phone = String(body?.phone || "").trim();

  if (!itemId || !name || !email) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const items = await listMarketplaceItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) {
    return NextResponse.json({ ok: false, error: "item_not_found" }, { status: 404 });
  }

  const orderRef = await createMarketplaceOrder({
    itemId,
    name,
    email,
    phone,
    status: "pending",
    provider: "internal",
  });

  return NextResponse.json({
    ok: true,
    orderRef,
    next: `/marketplace/sucesso?orderRef=${orderRef}&itemId=${itemId}`,
    item,
  });
}
