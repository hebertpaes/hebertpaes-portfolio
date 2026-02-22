"use client";

import { useState, useEffect, useRef } from "react";

type ChatMessage = { role: string; content: string };
type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

const STORAGE_KEY = "openclaw.chat.sessionId";
const DEFAULT_SESSION = "agent:codex:codex";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `web:${crypto.randomUUID()}`;
  }
  return `web:${Date.now()}`;
}

export default function OpenClawChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [sessionId, setSessionId] = useState(DEFAULT_SESSION);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const connected = connectionStatus === "connected";
  const connecting = connectionStatus === "connecting";

  // Endpoint público do proxy/ws
  const getWebSocketUrl = () => {
    const wsUrl = process.env.NEXT_PUBLIC_OPENCLAW_WS_URL;
    if (!wsUrl) {
      return "";
    }

    const token = process.env.NEXT_PUBLIC_OPENCLAW_TOKEN;
    if (!token) return wsUrl;

    const separator = wsUrl.includes("?") ? "&" : "?";
    return `${wsUrl}${separator}token=${encodeURIComponent(token)}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const statusMeta: Record<ConnectionStatus, { label: string; dot: string; panel: string }> = {
    disconnected: {
      label: "Disconnected",
      dot: "bg-slate-400",
      panel: "bg-slate-500/10 border-slate-400/30 text-slate-200",
    },
    connecting: {
      label: "Connecting...",
      dot: "bg-amber-400 animate-pulse",
      panel: "bg-amber-500/10 border-amber-400/30 text-amber-100",
    },
    connected: {
      label: "Connected",
      dot: "bg-emerald-400 animate-pulse",
      panel: "bg-emerald-500/10 border-emerald-400/30 text-emerald-100",
    },
    error: {
      label: "Connection Error",
      dot: "bg-red-500",
      panel: "bg-red-500/10 border-red-400/30 text-red-100",
    },
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) {
      setSessionId(saved);
      return;
    }

    const fresh = createSessionId();
    localStorage.setItem(STORAGE_KEY, fresh);
    setSessionId(fresh);
  }, []);

  const resetSession = () => {
    const fresh = createSessionId();
    localStorage.setItem(STORAGE_KEY, fresh);
    setSessionId(fresh);
    setMessages((prev) => [
      ...prev,
      { role: "system", content: `Session reset: ${fresh}` },
    ]);
  };

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const target = getWebSocketUrl();
    if (!target) {
      setConnectionStatus("error");
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "NEXT_PUBLIC_OPENCLAW_WS_URL não está configurada. Defina o endpoint público para conectar.",
        },
      ]);
      return;
    }

    setConnectionStatus("connecting");

    const ws = new WebSocket(target);

    ws.onopen = () => {
      setConnectionStatus("connected");
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `Connected to OpenClaw Gateway (${sessionId})` },
      ]);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message || JSON.stringify(data) },
        ]);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: event.data }]);
      }
    };

    ws.onerror = () => {
      setConnectionStatus("error");
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Connection error. Check public WS endpoint and OpenClaw proxy availability.",
        },
      ]);
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Disconnected from OpenClaw Gateway" },
      ]);
    };

    wsRef.current = ws;
  };

  const disconnect = () => {
    wsRef.current?.close();
    wsRef.current = null;
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !connected) return;

    const message = {
      type: "message",
      content: input,
      session: sessionId || DEFAULT_SESSION,
    };

    wsRef.current?.send(JSON.stringify(message));
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">OpenClaw Chat</h1>
          <p className="text-slate-300 text-sm">Direct connection to OpenClaw Gateway</p>

          <div className={`mt-4 border rounded-xl px-4 py-3 ${statusMeta[connectionStatus].panel}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusMeta[connectionStatus].dot}`} />
                <span className="text-sm font-medium">{statusMeta[connectionStatus].label}</span>
              </div>
              <div className="text-xs opacity-90 break-all">Session: {sessionId}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {!connected && !connecting && (
              <button
                onClick={connect}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                Connect
              </button>
            )}
            {connected && (
              <button
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                Disconnect
              </button>
            )}
            <button
              onClick={resetSession}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              New Session
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="h-96 overflow-y-auto mb-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <p>No messages yet. Connect to start chatting.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600/20 ml-12"
                    : msg.role === "system"
                    ? "bg-yellow-600/20 text-yellow-200 text-sm"
                    : "bg-white/10 mr-12"
                }`}
              >
                <div className="font-semibold text-xs mb-1 opacity-70">
                  {msg.role === "user" ? "You" : msg.role === "system" ? "System" : "OpenClaw"}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={connected ? "Type your message..." : "Connect to start chatting"}
              disabled={!connected}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!connected || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>

        <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
          <h3 className="font-bold text-cyan-200 mb-2">Connection Setup</h3>
          <ul className="text-sm text-cyan-100/90 mt-2 space-y-1 list-disc list-inside">
            <li>Configure <code>NEXT_PUBLIC_OPENCLAW_WS_URL</code> with public websocket endpoint</li>
            <li>Optional: set <code>NEXT_PUBLIC_OPENCLAW_TOKEN</code> for token query auth</li>
            <li>Session is persisted in <code>localStorage</code> across reloads</li>
          </ul>
        </div>

        <div className="mt-4 flex gap-3">
          <a href="/openclaw" className="text-cyan-300 hover:text-cyan-200 text-sm underline">
            ← Back to OpenClaw Hub
          </a>
          <a href="/" className="text-cyan-300 hover:text-cyan-200 text-sm underline">
            Home
          </a>
        </div>
      </div>
    </main>
  );
}
