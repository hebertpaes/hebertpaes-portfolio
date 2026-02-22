import { NextRequest, NextResponse } from "next/server";
import { validateOpenClawToken } from "./middleware";

export const runtime = "edge";

const UPSTREAM_WS = process.env.OPENCLAW_UPSTREAM_WS ?? "ws://74.235.188.0:18789";

/**
 * WebSocket proxy endpoint for OpenClaw.
 * Path: /api/openclaw
 *
 * NOTE:
 * Native WS upgrade support depends on deployment runtime.
 * On runtimes without WebSocketPair support, this route returns 501 with guidance.
 */
export async function GET(req: NextRequest) {
  const tokenResult = validateOpenClawToken(req);
  if (!tokenResult.ok) {
    return NextResponse.json(
      { error: tokenResult.message },
      { status: tokenResult.status ?? 401 },
    );
  }

  const upgrade = req.headers.get("upgrade")?.toLowerCase();
  if (upgrade !== "websocket") {
    return NextResponse.json(
      {
        error: "Expected WebSocket upgrade",
        usage: "Connect with ws/wss client and Upgrade: websocket",
      },
      { status: 426 },
    );
  }

  // @ts-expect-error - WebSocketPair availability depends on edge runtime implementation.
  if (typeof WebSocketPair === "undefined") {
    return NextResponse.json(
      {
        error: "WebSocketPair is not available in this runtime",
        hint: "Use Cloudflare Worker or a runtime that supports edge WS upgrades.",
      },
      { status: 501 },
    );
  }

  // @ts-expect-error - WebSocketPair is runtime-provided in compatible edge platforms.
  const pair = new WebSocketPair();
  const client = pair[0];
  const server = pair[1];
  server.accept();

  let upstream: WebSocket | null = null;

  try {
    upstream = new WebSocket(UPSTREAM_WS, []);
  } catch (error) {
    server.close(1011, "Upstream init failed");
    return NextResponse.json(
      { error: "Failed to initialize upstream WebSocket", details: String(error) },
      { status: 502 },
    );
  }

  const closeBoth = (code = 1011, reason = "Proxy closed") => {
    try {
      server.close(code, reason);
    } catch {}
    try {
      upstream?.close(code, reason);
    } catch {}
  };

  upstream.addEventListener("open", () => {
    // Send auth token immediately after open (gateway-side handling required)
    // For session-cookie auth, use server-side proxy token to authenticate upstream.
    const upstreamToken =
      tokenResult.token === "session-cookie"
        ? process.env.OPENCLAW_PROXY_TOKEN || ""
        : tokenResult.token || "";

    try {
      upstream?.send(JSON.stringify({ type: "auth", token: upstreamToken }));
    } catch {
      closeBoth(1011, "Auth handshake failed");
    }
  });

  upstream.addEventListener("message", (event: MessageEvent) => {
    try {
      server.send(event.data);
    } catch {
      closeBoth(1011, "Downstream send failed");
    }
  });

  upstream.addEventListener("close", () => {
    closeBoth(1000, "Upstream closed");
  });

  upstream.addEventListener("error", () => {
    closeBoth(1011, "Upstream error");
  });

  server.addEventListener("message", (event: MessageEvent) => {
    try {
      upstream?.send(event.data);
    } catch {
      closeBoth(1011, "Upstream send failed");
    }
  });

  server.addEventListener("close", () => {
    closeBoth(1000, "Client closed");
  });

  server.addEventListener("error", () => {
    closeBoth(1011, "Client socket error");
  });

  return new Response(null, {
    status: 101,
    // @ts-expect-error - supported only on compatible edge runtime.
    webSocket: client,
  });
}
