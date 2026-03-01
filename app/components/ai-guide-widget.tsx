"use client";

import { useState } from "react";

const interests = [
  { key: "negocios", label: "Negócios" },
  { key: "marketing", label: "Marketing" },
  { key: "ia", label: "IA" },
  { key: "vendas", label: "Vendas" },
  { key: "conteudo", label: "Conteúdo" },
  { key: "trafego", label: "Tráfego" },
];

export default function AIGuideWidget({ source = "home" }: { source?: "home" | "cursos" | "marketplace" }) {
  const [interest, setInterest] = useState("negocios");
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<any>(null);

  const runGuide = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") localStorage.setItem("ai_interest", interest);
      const res = await fetch("/api/ai/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest, source }),
      });
      const data = await res.json();
      setGuide(data?.guide || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
      <h3 className="text-xl font-bold">Assistente IA de orientação</h3>
      <p className="mt-1 text-sm text-slate-300">Selecione seu foco e receba um plano personalizado para avançar rápido.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {interests.map((it) => (
          <button
            key={it.key}
            onClick={() => setInterest(it.key)}
            className={`rounded-full border px-3 py-1.5 text-sm ${interest === it.key ? "border-cyan-300/70 bg-cyan-300/20 text-cyan-100" : "border-white/20 bg-white/5 text-slate-300"}`}
          >
            {it.label}
          </button>
        ))}
      </div>

      <button onClick={runGuide} disabled={loading} className="mt-3 rounded-xl border border-white/20 bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60">
        {loading ? "Gerando plano..." : "Gerar plano com IA"}
      </button>

      {guide && (
        <div className="mt-4 space-y-2">
          <p className="font-semibold text-cyan-200">{guide.title}</p>
          <p className="text-sm text-slate-300">{guide.message}</p>
          {guide.recommended?.map((r: any) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-sm font-semibold">Passo {r.step}: {r.title}</p>
              <p className="text-xs text-slate-300">{r.action}</p>
              <a href={r.href} className="mt-1 inline-block text-xs text-cyan-200 underline">Abrir recomendação</a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
