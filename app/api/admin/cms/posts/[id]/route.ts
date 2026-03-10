import { NextRequest, NextResponse } from "next/server";
import { deleteCmsPost, getCmsPost, updateCmsPost } from "@/lib/cms/store";
import { badRequest, ensureCmsAdmin, internalServerError } from "@/lib/cms/http";
import { isUniqueConstraintError } from "@/lib/cms/errors";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  const params = await context.params;
  const id = parseId(params.id);
  if (!id) return badRequest("invalid_id");

  try {
    const item = await getCmsPost(id);
    if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return internalServerError(error);
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  const params = await context.params;
  const id = parseId(params.id);
  if (!id) return badRequest("invalid_id");

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("invalid_payload");
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!title || !content) return badRequest("invalid_payload");

  try {
    const item = await updateCmsPost(id, {
      title,
      slug: typeof body.slug === "string" ? body.slug : undefined,
      excerpt: typeof body.excerpt === "string" ? body.excerpt : undefined,
      content,
      status: body.status === "published" ? "published" : "draft",
      authorUserId: typeof body.authorUserId === "number" ? body.authorUserId : undefined,
      categoryIds: Array.isArray(body.categoryIds) ? body.categoryIds : undefined,
      tagIds: Array.isArray(body.tagIds) ? body.tagIds : undefined,
    });

    if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ ok: false, error: "conflict" }, { status: 409 });
    }
    return internalServerError(error);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  const params = await context.params;
  const id = parseId(params.id);
  if (!id) return badRequest("invalid_id");

  try {
    const deleted = await deleteCmsPost(id);
    if (!deleted) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return internalServerError(error);
  }
}
