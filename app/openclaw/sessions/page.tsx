"use client";

import { useEffect, useState } from "react";

type SessionItem = { id: string; model: string; status: string; updatedAt: string };

export default function OpenClawSessionsPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  useEffect(() => {
    fetch("/api/prototype/sessions")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions || []))
      .catch(() => setSessions([]));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Sessões</h1>
        <div className="grid gap-3">
          {sessions.map((s) => (
            <article key={s.id} className="bg-white/10 border border-white/15 rounded-xl p-4">
              <p className="font-bold">{s.id}</p>
              <p className="text-sm text-slate-300">{s.model}</p>
              <p className="text-xs text-emerald-300 mt-1">{s.status} • {new Date(s.updatedAt).toLocaleString("pt-BR")}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
