import crypto from "node:crypto";

type SessionData = {
  sub: string;
  login: string;
  name?: string;
  email?: string;
  provider: "github";
  iat: number;
  exp: number;
};

const SESSION_COOKIE = "openclaw_session";

function base64url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getSecret() {
  return process.env.SESSION_SECRET || process.env.GITHUB_CLIENT_SECRET || "change-me";
}

function sign(payloadB64: string) {
  return crypto.createHmac("sha256", getSecret()).update(payloadB64).digest("base64url");
}

export function createSessionToken(data: Omit<SessionData, "iat" | "exp">, ttlSeconds = 60 * 60 * 24 * 7) {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionData = {
    ...data,
    iat: now,
    exp: now + ttlSeconds,
  };
  const payloadB64 = base64url(JSON.stringify(payload));
  const signature = sign(payloadB64);
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionData | null {
  if (!token || !token.includes(".")) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expected = sign(payloadB64);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    const payload = JSON.parse(fromBase64url(payloadB64)) as SessionData;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieName = SESSION_COOKIE;
