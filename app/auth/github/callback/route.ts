import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, sessionCookieName } from "@/lib/session";

export const runtime = "nodejs";

function baseUrl(req: NextRequest) {
  return process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
}

function sanitizeNext(next?: string | null) {
  if (!next) return "/openclaw/agents";
  if (!next.startsWith("/")) return "/openclaw/agents";
  if (next.startsWith("//")) return "/openclaw/agents";
  return next;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const stateCookie = req.cookies.get("openclaw_oauth_state_github")?.value;

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(new URL("/login?error=oauth_state", baseUrl(req)));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || "https://hebertpaes.com/auth/github/callback";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=oauth_not_configured", baseUrl(req)));
  }

  try {
    const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenJson = await tokenResp.json();
    const accessToken = tokenJson?.access_token as string | undefined;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/login?error=oauth_token", baseUrl(req)));
    }

    const [userResp, emailsResp] = await Promise.all([
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "hebertpaes-openclaw",
        },
      }),
      fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "hebertpaes-openclaw",
        },
      }),
    ]);

    const user = await userResp.json();
    const emails = await emailsResp.json();

    const primaryEmail = Array.isArray(emails)
      ? (emails.find((e: any) => e.primary)?.email ?? emails[0]?.email)
      : undefined;

    const sessionToken = createSessionToken({
      sub: String(user.id),
      login: user.login ?? "github-user",
      name: user.name ?? undefined,
      email: user.email ?? primaryEmail ?? undefined,
      provider: "github",
    });

    const res = NextResponse.redirect(new URL(sanitizeNext(req.cookies.get("openclaw_oauth_next")?.value), baseUrl(req)));
    res.cookies.set(sessionCookieName, sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set("openclaw_oauth_state_github", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    res.cookies.set("openclaw_oauth_next", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth_exchange", baseUrl(req)));
  }
}
