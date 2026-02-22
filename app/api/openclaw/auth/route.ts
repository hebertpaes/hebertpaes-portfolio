import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, sessionCookieName } from "@/lib/session";

export const runtime = "nodejs";

type Provider = "github" | "google" | "microsoft" | "apple" | "linkedin" | "whatsapp";

type ProviderConfig = {
  authUrl: string;
  tokenUrl?: string;
  userUrl?: string;
  scope: string;
  clientIdEnv: string;
  clientSecretEnv: string;
  callbackPath: string;
};

const PROVIDERS: Record<Provider, ProviderConfig> = {
  github: {
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userUrl: "https://api.github.com/user",
    scope: "read:user user:email",
    clientIdEnv: "GITHUB_CLIENT_ID",
    clientSecretEnv: "GITHUB_CLIENT_SECRET",
    callbackPath: "/auth/github/callback",
  },
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    scope: "openid email profile",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
    callbackPath: "/api/openclaw/auth?provider=google&action=callback",
  },
  microsoft: {
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    userUrl: "https://graph.microsoft.com/v1.0/me",
    scope: "openid profile email offline_access User.Read",
    clientIdEnv: "MICROSOFT_CLIENT_ID",
    clientSecretEnv: "MICROSOFT_CLIENT_SECRET",
    callbackPath: "/api/openclaw/auth?provider=microsoft&action=callback",
  },
  apple: {
    authUrl: "https://appleid.apple.com/auth/authorize",
    tokenUrl: "https://appleid.apple.com/auth/token",
    scope: "name email",
    clientIdEnv: "APPLE_CLIENT_ID",
    clientSecretEnv: "APPLE_CLIENT_SECRET",
    callbackPath: "/api/openclaw/auth?provider=apple&action=callback",
  },
  linkedin: {
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    userUrl: "https://api.linkedin.com/v2/userinfo",
    scope: "openid profile email",
    clientIdEnv: "LINKEDIN_CLIENT_ID",
    clientSecretEnv: "LINKEDIN_CLIENT_SECRET",
    callbackPath: "/api/openclaw/auth?provider=linkedin&action=callback",
  },
  whatsapp: {
    authUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
    userUrl: "https://graph.facebook.com/v20.0/me?fields=id,name",
    scope: "whatsapp_business_management whatsapp_business_messaging business_management",
    clientIdEnv: "WHATSAPP_CLIENT_ID",
    clientSecretEnv: "WHATSAPP_CLIENT_SECRET",
    callbackPath: "/api/openclaw/auth?provider=whatsapp&action=callback",
  },
};

function ensureProvider(value: string | null): Provider | null {
  if (!value) return null;
  const normalized = value.toLowerCase() as Provider;
  return normalized in PROVIDERS ? normalized : null;
}

function getBaseUrl(req: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
}

function callbackForProvider(req: NextRequest, provider: Provider) {
  if (provider === "github") {
    return process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || `${getBaseUrl(req)}/auth/github/callback`;
  }
  return `${getBaseUrl(req)}${PROVIDERS[provider].callbackPath}`;
}

export async function GET(req: NextRequest) {
  const provider = ensureProvider(req.nextUrl.searchParams.get("provider"));
  const action = req.nextUrl.searchParams.get("action") ?? "start";

  if (!provider) {
    return NextResponse.json({ error: "Unsupported provider", supported: Object.keys(PROVIDERS) }, { status: 400 });
  }

  const config = PROVIDERS[provider];
  const clientId = process.env[config.clientIdEnv];
  const clientSecret = process.env[config.clientSecretEnv];

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${getBaseUrl(req)}/login?error=${provider}_not_configured`);
  }

  const callbackUrl = callbackForProvider(req, provider);

  if (action === "start") {
    const state = crypto.randomUUID();
    const auth = new URL(config.authUrl);
    auth.searchParams.set("client_id", clientId);
    auth.searchParams.set("redirect_uri", callbackUrl);
    auth.searchParams.set("response_type", "code");
    auth.searchParams.set("scope", config.scope);
    auth.searchParams.set("state", state);

    const res = NextResponse.redirect(auth.toString(), { status: 302 });
    res.cookies.set(`openclaw_oauth_state_${provider}`, state, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 10,
    });
    return res;
  }

  if (action !== "callback") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // github callback is handled by /auth/github/callback
  if (provider === "github") {
    return NextResponse.redirect(new URL(`/auth/github/callback${req.nextUrl.search}`, req.url));
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const stateCookie = req.cookies.get(`openclaw_oauth_state_${provider}`)?.value;

  if (!code) return NextResponse.redirect(new URL("/login?error=oauth_code", req.url));
  if (!state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(new URL("/login?error=oauth_state", req.url));
  }

  try {
    const tokenPayload = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: callbackUrl,
      grant_type: "authorization_code",
    });

    const tokenResp = await fetch(config.tokenUrl!, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenPayload.toString(),
    });

    const tokenJson = await tokenResp.json();
    const accessToken = tokenJson?.access_token as string | undefined;
    const idToken = tokenJson?.id_token as string | undefined;

    if (!accessToken && !idToken) {
      return NextResponse.redirect(new URL(`/login?error=${provider}_token`, req.url));
    }

    let profile: any = {};

    if (config.userUrl && accessToken) {
      const userResp = await fetch(config.userUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "User-Agent": "hebertpaes-openclaw",
        },
      });
      profile = await userResp.json();
    }

    if (provider === "apple" && idToken) {
      const payloadPart = idToken.split(".")[1];
      if (payloadPart) {
        try {
          profile = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
        } catch {}
      }
    }

    const sessionToken = createSessionToken({
      sub: String(profile.sub || profile.id || profile.user_id || crypto.randomUUID()),
      login:
        profile.login ||
        profile.preferred_username ||
        profile.name ||
        profile.localizedFirstName ||
        `${provider}-user`,
      name: profile.name || profile.displayName || profile.localizedFirstName || undefined,
      email: profile.email || profile.userPrincipalName || undefined,
      provider,
    });

    const res = NextResponse.redirect(new URL("/openclaw/agents", req.url));
    res.cookies.set(sessionCookieName, sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    res.cookies.set(`openclaw_oauth_state_${provider}`, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch {
    return NextResponse.redirect(new URL(`/login?error=${provider}_exchange`, req.url));
  }
}
