import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Provider =
  | "github"
  | "google"
  | "microsoft"
  | "apple"
  | "linkedin"
  | "whatsapp";

const PROVIDERS: Record<Provider, {
  authUrl: string;
  scope: string;
  clientIdEnv: string;
  clientSecretEnv: string;
}> = {
  github: {
    authUrl: "https://github.com/login/oauth/authorize",
    scope: "read:user user:email",
    clientIdEnv: "GITHUB_CLIENT_ID",
    clientSecretEnv: "GITHUB_CLIENT_SECRET",
  },
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "openid email profile",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
  },
  microsoft: {
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    scope: "openid profile email offline_access User.Read",
    clientIdEnv: "MICROSOFT_CLIENT_ID",
    clientSecretEnv: "MICROSOFT_CLIENT_SECRET",
  },
  apple: {
    authUrl: "https://appleid.apple.com/auth/authorize",
    scope: "name email",
    clientIdEnv: "APPLE_CLIENT_ID",
    clientSecretEnv: "APPLE_CLIENT_SECRET",
  },
  linkedin: {
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    scope: "openid profile email",
    clientIdEnv: "LINKEDIN_CLIENT_ID",
    clientSecretEnv: "LINKEDIN_CLIENT_SECRET",
  },
  whatsapp: {
    // Meta OAuth entry-point (WhatsApp Business via Meta app)
    authUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    scope: "whatsapp_business_management whatsapp_business_messaging business_management",
    clientIdEnv: "WHATSAPP_CLIENT_ID",
    clientSecretEnv: "WHATSAPP_CLIENT_SECRET",
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

/**
 * /api/openclaw/auth?provider=github&action=start
 * /api/openclaw/auth?provider=github&action=callback&code=...
 */
export async function GET(req: NextRequest) {
  const provider = ensureProvider(req.nextUrl.searchParams.get("provider"));
  const action = req.nextUrl.searchParams.get("action") ?? "start";

  if (!provider) {
    return NextResponse.json(
      {
        error: "Unsupported provider",
        supported: Object.keys(PROVIDERS),
      },
      { status: 400 },
    );
  }

  const config = PROVIDERS[provider];
  const clientId = process.env[config.clientIdEnv];
  const clientSecret = process.env[config.clientSecretEnv];

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error: `Missing OAuth credentials for ${provider}`,
        required: [config.clientIdEnv, config.clientSecretEnv],
      },
      { status: 500 },
    );
  }

  const callbackUrl =
    provider === "github"
      ? process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || `${getBaseUrl(req)}/auth/github/callback`
      : `${getBaseUrl(req)}/api/openclaw/auth?provider=${provider}&action=callback`;

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

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const stateCookie = req.cookies.get(`openclaw_oauth_state_${provider}`)?.value;

  if (!code) {
    return NextResponse.json({ error: "Missing OAuth code" }, { status: 400 });
  }

  if (!state || !stateCookie || state !== stateCookie) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  }

  // Generic callback response. Token exchange endpoint differs per provider;
  // perform provider-specific code exchange in your service layer as needed.
  const payload = {
    ok: true,
    provider,
    message: "OAuth callback received",
    next: "Exchange authorization code for access token using provider-specific token endpoint.",
    code,
  };

  const res = NextResponse.json(payload, { status: 200 });
  res.cookies.set(`openclaw_oauth_state_${provider}`, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}
