import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, sessionCookieName } from "@/lib/session";
import { getSessionFromRequest } from "@/lib/auth-guard";
import { verifyTotp } from "@/lib/totp";

const defaultAllowedLogins = ["hebertpaes"];
const defaultAllowedEmails = ["ciencia@msn.com"];

function parseCsv(raw?: string) {
  return (raw || "")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const allowedLogins = parseCsv(process.env.SUPER_ADMIN_GITHUB_LOGINS);
  const allowedEmails = parseCsv(process.env.SUPER_ADMIN_EMAILS);

  const login = (session.login || "").toLowerCase();
  const email = (session.email || "").toLowerCase();

  const canElevate =
    session.provider === "github" &&
    (allowedLogins.includes(login) || allowedEmails.includes(email) || defaultAllowedLogins.includes(login) || defaultAllowedEmails.includes(email));

  if (!canElevate) {
    return NextResponse.json({ ok: false, error: "not_allowed" }, { status: 403 });
  }

  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "totp_not_configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const code = String(body?.code || "");

  const valid = verifyTotp(code, secret);
  if (!valid) {
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 401 });
  }

  const adminToken = createSessionToken(
    {
      sub: session.sub,
      login: session.login,
      name: session.name,
      email: session.email,
      provider: session.provider,
      role: "admin",
    },
    60 * 60 * 12
  );

  const res = NextResponse.json({ ok: true, next: "/admin/dashboard" });
  res.cookies.set(sessionCookieName, adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
    priority: "high",
  });

  return res;
}
