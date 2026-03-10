import { NextRequest, NextResponse } from "next/server";
import { createCmsPost, listCmsPosts } from "@/lib/cms/store";
import { badRequest, ensureCmsAdmin, internalServerError } from "@/lib/cms/http";
import { isUniqueConstraintError } from "@/lib/cms/errors";

export async function GET(req: NextRequest) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const items = await listCmsPosts();
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
  const content = String(body?.content || "").trim();

  if (!title || !content) {
    return badRequest("invalid_payload");
  }

  try {
    const item = await createCmsPost({
      title,
      slug: typeof body?.slug === "string" ? body.slug : undefined,
      excerpt: typeof body?.excerpt === "string" ? body.excerpt : undefined,
      content,
      status: body?.status === "published" ? "published" : "draft",
      authorUserId: typeof body?.authorUserId === "number" ? body.authorUserId : undefined,
      categoryIds: Array.isArray(body?.categoryIds) ? body.categoryIds : undefined,
      tagIds: Array.isArray(body?.tagIds) ? body.tagIds : undefined,
    });

    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ ok: false, error: "conflict" }, { status: 409 });
    }
    return internalServerError(error);
  }
}
