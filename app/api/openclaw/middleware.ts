import { NextRequest } from "next/server";

export type TokenValidationResult = {
  ok: boolean;
  status?: number;
  message?: string;
  token?: string;
};

/**
 * Validação para proxy OpenClaw.
 * Aceita:
 * - sessão autenticada via cookie openclaw_session (fluxo web/mobile)
 * - token explícito (Bearer/header/query) para clientes técnicos
 */
export function validateOpenClawToken(req: NextRequest): TokenValidationResult {
  const hasSessionCookie = Boolean(req.cookies.get("openclaw_session")?.value);
  if (hasSessionCookie) {
    return { ok: true, token: "session-cookie" };
  }

  const publicChatEnabled = process.env.OPENCLAW_PUBLIC_CHAT === "true";
  if (publicChatEnabled) {
    return { ok: true, token: "public" };
  }

  const expected = process.env.OPENCLAW_PROXY_TOKEN;
  if (!expected) {
    return {
      ok: false,
      status: 500,
      message: "OPENCLAW_PROXY_TOKEN not configured",
    };
  }

  const auth = req.headers.get("authorization") ?? "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  const headerToken = req.headers.get("x-openclaw-token")?.trim() ?? "";
  const queryToken = req.nextUrl.searchParams.get("token")?.trim() ?? "";
  const token = bearer || headerToken || queryToken;

  if (!token) return { ok: false, status: 401, message: "Missing token" };
  if (token !== expected) return { ok: false, status: 403, message: "Invalid token" };

  return { ok: true, token };
}
