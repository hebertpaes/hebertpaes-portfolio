import { NextRequest, NextResponse } from "next/server";
import { createCmsMedia, listCmsMedia } from "@/lib/cms/store";
import { badRequest, ensureCmsAdmin, internalServerError } from "@/lib/cms/http";

export async function GET(req: NextRequest) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const items = await listCmsMedia();
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    return internalServerError(error);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const title = String(body?.title || "").trim();
  const url = String(body?.url || "").trim();

  if (!title || !url) {
    return badRequest("invalid_payload");
  }

  try {
    const item = await createCmsMedia({
      title,
      url,
      altText: typeof body?.altText === "string" ? body.altText : undefined,
      mimeType: typeof body?.mimeType === "string" ? body.mimeType : undefined,
      sizeBytes: typeof body?.sizeBytes === "number" ? body.sizeBytes : undefined,
    });

    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    return internalServerError(error);
  }
}
