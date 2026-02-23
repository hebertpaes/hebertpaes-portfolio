import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const base = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://hebertpaes.com";
  const url = new URL("/api/openclaw/auth", base);
  url.searchParams.set("provider", "google");
  url.searchParams.set("action", "callback");

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (code) url.searchParams.set("code", code);
  if (state) url.searchParams.set("state", state);
  if (error) url.searchParams.set("error", error);

  return NextResponse.redirect(url);
}
