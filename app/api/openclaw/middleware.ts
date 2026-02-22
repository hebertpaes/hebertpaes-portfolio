import { NextRequest } from "next/server";

export type TokenValidationResult = {
  ok: boolean;
  status?: number;
  message?: string;
  token?: string;
};

/**
 * Validates OpenClaw proxy token from headers or query string.
 * Accepted inputs:
 * - Authorization: Bearer <token>
 * - x-openclaw-token: <token>
 * - ?token=<token>
 */
export function validateOpenClawToken(req: NextRequest): TokenValidationResult {
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

  if (!token) {
    return {
      ok: false,
      status: 401,
      message: "Missing token",
    };
  }

  if (token !== expected) {
    return {
      ok: false,
      status: 403,
      message: "Invalid token",
    };
  }

  return { ok: true, token };
}
