import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth-guard";

export function ensureCmsAdmin(req: NextRequest) {
  if (hasAdminSession(req)) return null;
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

export function internalServerError(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}
