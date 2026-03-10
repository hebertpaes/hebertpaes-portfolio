import { NextRequest, NextResponse } from "next/server";
import { createCmsCategory, listCmsCategories } from "@/lib/cms/store";
import { badRequest, ensureCmsAdmin, internalServerError } from "@/lib/cms/http";
import { isUniqueConstraintError } from "@/lib/cms/errors";

export async function GET(req: NextRequest) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const items = await listCmsCategories();
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    return internalServerError(error);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const name = String(body?.name || "").trim();
  if (!name) return badRequest("invalid_payload");

  try {
    const item = await createCmsCategory({
      name,
      slug: typeof body?.slug === "string" ? body.slug : undefined,
      description: typeof body?.description === "string" ? body.description : undefined,
    });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ ok: false, error: "conflict" }, { status: 409 });
    }
    return internalServerError(error);
  }
}
