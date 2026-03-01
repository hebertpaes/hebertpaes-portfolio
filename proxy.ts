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

const rateLimitedPaths = ["/api/admin/login", "/api/openclaw/auth"];

type RateBucket = { count: number; resetAt: number };
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

const rateStore = globalThis as typeof globalThis & {
  __openclawRateLimit?: Map<string, RateBucket>;
};

if (!rateStore.__openclawRateLimit) {
  rateStore.__openclawRateLimit = new Map<string, RateBucket>();
}

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(req: NextRequest) {
  if (!rateLimitedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return false;
  }

  const key = `${getClientIp(req)}:${req.nextUrl.pathname}`;
  const now = Date.now();
  const bucket = rateStore.__openclawRateLimit!.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateStore.__openclawRateLimit!.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (bucket.count >= MAX_REQUESTS) {
    return true;
  }

  bucket.count += 1;
  rateStore.__openclawRateLimit!.set(key, bucket);
  return false;
}

function getCsp() {
  const isDev = process.env.NODE_ENV !== "production";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com data:",
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com${isDev ? "" : ""}`,
    isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
    "connect-src 'self' https:",
    "frame-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function applySecurityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  res.headers.set("Content-Security-Policy", getCsp());
  return res;
}

export function proxy(req: NextRequest) {
  if (isRateLimited(req)) {
    return applySecurityHeaders(new NextResponse("Too many requests", { status: 429 }));
  }

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
