"use client";

import { useEffect, useState } from "react";

type Item = { name: string; schedule: string; state: string };

export default function OpenClawAutomationsPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/prototype/automations")
      .then((r) => r.json())
      .then((d) => setItems(d.automations || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Automações</h1>
        <div className="grid gap-3">
          {items.map((a) => (
            <article key={a.name} className="bg-white/10 border border-white/15 rounded-xl p-4">
              <p className="font-bold">{a.name}</p>
              <p className="text-sm text-slate-300">Agendamento: {a.schedule}</p>
              <p className="text-xs text-emerald-300 mt-1">{a.state}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
