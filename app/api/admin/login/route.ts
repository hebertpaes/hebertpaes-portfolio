import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, sessionCookieName } from "@/lib/session";
import { validateAdminLogin } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email || "");
  const password = String(body?.password || "");

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "E-mail e senha são obrigatórios" }, { status: 400 });
  }

  try {
    const admin = await validateAdminLogin(email, password);
    if (!admin) {
      return NextResponse.json({ ok: false, error: "Credenciais inválidas" }, { status: 401 });
    }

    const token = createSessionToken(
      {
        sub: `admin:${admin.email}`,
        login: admin.email,
        name: admin.name,
        email: admin.email,
        provider: "local",
        role: "admin",
      },
      60 * 60 * 12
    );

    const res = NextResponse.json({ ok: true, next: "/admin/dashboard" });
    res.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 12,
      priority: "high",
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Falha de autenticação no banco" }, { status: 500 });
  }
}
