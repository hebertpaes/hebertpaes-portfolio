import { NextRequest, NextResponse } from "next/server";
import { listCmsSettings, upsertCmsSetting } from "@/lib/cms/store";
import { badRequest, ensureCmsAdmin, internalServerError } from "@/lib/cms/http";

export async function GET(req: NextRequest) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const items = await listCmsSettings();
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    return internalServerError(error);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const keyName = String(body?.keyName || "").trim();
  const value = String(body?.value || "");

  if (!keyName) return badRequest("invalid_payload");

  try {
    const item = await upsertCmsSetting({
      keyName,
      value,
      groupName: typeof body?.groupName === "string" ? body.groupName : undefined,
    });

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return internalServerError(error);
  }
}
