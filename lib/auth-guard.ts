import { NextRequest } from "next/server";
import { sessionCookieName, verifySessionToken } from "@/lib/session";

export function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName)?.value;
  return verifySessionToken(token);
}

export function hasValidSession(req: NextRequest) {
  return Boolean(getSessionFromRequest(req));
}

export function hasAdminSession(req: NextRequest) {
  const session = getSessionFromRequest(req);
  return Boolean(session && session.role === "admin");
}
