import { NextRequest } from "next/server";
import { sessionCookieName, verifySessionToken } from "@/lib/session";

export function hasValidSession(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName)?.value;
  return Boolean(verifySessionToken(token));
}
