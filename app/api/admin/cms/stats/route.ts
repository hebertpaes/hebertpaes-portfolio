import { NextRequest, NextResponse } from "next/server";
import { getCmsStats } from "@/lib/cms/store";
import { ensureCmsAdmin, internalServerError } from "@/lib/cms/http";

export async function GET(req: NextRequest) {
  const unauthorized = ensureCmsAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const stats = await getCmsStats();
    return NextResponse.json({ ok: true, stats, updatedAt: new Date().toISOString() });
  } catch (error) {
    return internalServerError(error);
  }
}
