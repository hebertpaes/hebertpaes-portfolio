import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

const protectedPrefixes = [
  "/openclaw/agents",
  "/openclaw/app",
  "/openclaw/sessions",
  "/openclaw/automations",
  "/openclaw/status",
  "/admin/dashboard",
];

function applySecurityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' https:",
      "frame-src 'self'",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  return res;
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const requiresAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!requiresAuth) {
    return applySecurityHeaders(NextResponse.next());
  }

  const token = req.cookies.get("openclaw_session")?.value;
  const session = verifySessionToken(token);
  const isAdminRoute = pathname.startsWith("/admin");

  if (session && (!isAdminRoute || session.role === "admin")) {
    return applySecurityHeaders(NextResponse.next());
  }

  const loginUrl = new URL(isAdminRoute ? "/admin/login" : "/login", req.url);
  loginUrl.searchParams.set("error", "auth_required");
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return applySecurityHeaders(NextResponse.redirect(loginUrl));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)"],
};
