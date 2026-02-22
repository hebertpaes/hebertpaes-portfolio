import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/openclaw/agents", "/openclaw/app", "/openclaw/sessions", "/openclaw/automations", "/openclaw/status"];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const requiresAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!requiresAuth) return NextResponse.next();

  const hasSessionCookie = Boolean(req.cookies.get("openclaw_session")?.value);
  if (hasSessionCookie) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("error", "auth_required");
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/openclaw/:path*"],
};
