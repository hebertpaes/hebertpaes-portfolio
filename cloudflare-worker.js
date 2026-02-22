/**
 * Cloudflare Worker - OpenClaw WebSocket Proxy
 * Route: /openclaw/ws
 * Upstream: ws://74.235.188.0:18789
 */

const DEFAULT_UPSTREAM = "ws://74.235.188.0:18789";
const WS_PATH = "/openclaw/ws";

function isWebSocketUpgrade(request) {
  const upgrade = request.headers.get("Upgrade");
  return upgrade && upgrade.toLowerCase() === "websocket";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== WS_PATH) {
      return new Response("Not Found", { status: 404 });
    }

    if (!isWebSocketUpgrade(request)) {
      return new Response("Expected WebSocket upgrade", { status: 426 });
    }

    const token =
      env.OPENCLAW_PROXY_TOKEN ||
      url.searchParams.get("token") ||
      request.headers.get("X-OpenClaw-Token");

    if (!token) {
      return new Response("Unauthorized: missing token", { status: 401 });
    }

    const upstreamUrl = env.OPENCLAW_UPSTREAM_WS || DEFAULT_UPSTREAM;
    const upstreamResp = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Upgrade: "websocket",
        Connection: "Upgrade",
        Authorization: `Bearer ${token}`,
        "X-OpenClaw-Token": token,
      },
    });

    if (upstreamResp.status !== 101 || !upstreamResp.webSocket) {
      const body = await upstreamResp.text().catch(() => "");
      return new Response(`Upstream refused WS (${upstreamResp.status}) ${body}`, { status: 502 });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const worker = pair[1];
    const upstream = upstreamResp.webSocket;

    worker.accept();
    upstream.accept();

    worker.addEventListener("message", (evt) => {
      try {
        upstream.send(evt.data);
      } catch {}
    });

    upstream.addEventListener("message", (evt) => {
      try {
        worker.send(evt.data);
      } catch {}
    });

    worker.addEventListener("close", () => {
      try {
        upstream.close(1000, "Client closed");
      } catch {}
    });

    upstream.addEventListener("close", () => {
      try {
        worker.close(1000, "Upstream closed");
      } catch {}
    });

    return new Response(null, { status: 101, webSocket: client });
  },
};
