import { NextRequest, NextResponse } from "next/server";
import { createCmsTag, listCmsTags } from "@/lib/cms/store";
import { badRequest, ensureCmsAdmin, internalServerError } from "@/lib/cms/http";
import { isUniqueConstraintError } from "@/lib/cms/errors";

export async function GET(req: NextRequest) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const items = await listCmsTags();
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
    const item = await createCmsTag({ name, slug: typeof body?.slug === "string" ? body.slug : undefined });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ ok: false, error: "conflict" }, { status: 409 });
    }
    return internalServerError(error);
  }
}
