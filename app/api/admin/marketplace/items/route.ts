import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth-guard";
import {
  createMarketplaceItem,
  deleteMarketplaceItem,
  listMarketplaceItemsAdmin,
  updateMarketplaceItem,
  updateMarketplaceItemActive,
} from "@/lib/marketplace-store";

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const items = await listMarketplaceItemsAdmin();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);

  const type = String(body?.type || "").toLowerCase();
  const title = String(body?.title || "").trim();
  const description = String(body?.description || "").trim();
  const priceLabel = String(body?.priceLabel || "").trim();
  const category = String(body?.category || "").trim();

  if (!title || !description || !priceLabel || !category || !["produto", "servico"].includes(type)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const item = await createMarketplaceItem({ type: type as "produto" | "servico", title, description, priceLabel, category, active: true });
  return NextResponse.json({ ok: true, item });
}

export async function PATCH(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = String(body?.id || "").trim();
  const active = Boolean(body?.active);
  if (!id) return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });

  await updateMarketplaceItemActive(id, active);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);

  const id = String(body?.id || "").trim();
  const type = String(body?.type || "").toLowerCase();
  const title = String(body?.title || "").trim();
  const description = String(body?.description || "").trim();
  const priceLabel = String(body?.priceLabel || "").trim();
  const category = String(body?.category || "").trim();
  const active = Boolean(body?.active);

  if (!id || !title || !description || !priceLabel || !category || !["produto", "servico"].includes(type)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  await updateMarketplaceItem({ id, type: type as "produto" | "servico", title, description, priceLabel, category, active });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const id = String(req.nextUrl.searchParams.get("id") || "").trim();
  if (!id) return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });

  await deleteMarketplaceItem(id);
  return NextResponse.json({ ok: true });
}
