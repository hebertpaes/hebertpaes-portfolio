"use client";

import { useEffect, useState } from "react";

type Status = {
  gateway: string;
  auth: string;
  sql: string;
  websocketProxy: string;
  updatedAt: string;
};

export default function OpenClawStatusPage() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/api/prototype/status")
      .then((r) => r.json())
      .then((d) => setStatus(d))
      .catch(() => setStatus(null));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Status & Segurança</h1>
        {!status ? (
          <p className="text-slate-300">Carregando status...</p>
        ) : (
          <div className="bg-white/10 border border-white/15 rounded-2xl p-6 space-y-2">
            <p><strong>Gateway:</strong> {status.gateway}</p>
            <p><strong>Auth:</strong> {status.auth}</p>
            <p><strong>SQL:</strong> {status.sql}</p>
            <p><strong>WebSocket Proxy:</strong> {status.websocketProxy}</p>
            <p className="text-xs text-slate-300">Atualizado em: {new Date(status.updatedAt).toLocaleString("pt-BR")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
