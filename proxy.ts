import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

const protectedPrefixes = ["/openclaw/agents", "/openclaw/app", "/openclaw/sessions", "/openclaw/automations", "/openclaw/status", "/admin/dashboard"];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const requiresAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!requiresAuth) return NextResponse.next();

  const token = req.cookies.get("openclaw_session")?.value;
  const session = verifySessionToken(token);
  const isAdminRoute = pathname.startsWith("/admin");

  if (session && (!isAdminRoute || session.role === "admin")) {
    return NextResponse.next();
  }

  const loginUrl = new URL(isAdminRoute ? "/admin/login" : "/login", req.url);
  loginUrl.searchParams.set("error", "auth_required");
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/openclaw/:path*", "/admin/:path*"],
};
