"use client";

import { useEffect, useState } from "react";

type Agent = { id: string; name: string; model: string; status: string };

export default function OpenClawAppPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("codex");
  const [prompt, setPrompt] = useState("Resumo do status do projeto");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/prototype/agents")
      .then((r) => r.json())
      .then((data) => setAgents(data.agents || []))
      .catch(() => setAgents([]));
  }, []);

  async function runAgent() {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/prototype/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: selectedAgent, prompt }),
      });
      const data = await res.json();
      setOutput(data.response || data.error || "Sem resposta");
    } catch {
      setOutput("Falha ao executar protótipo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl font-black">OpenClaw App Prototype</h1>
          <a href="/openclaw/agents" className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold">Agents Hub</a>
        </header>

        <section className="grid md:grid-cols-3 gap-3">
          {agents.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAgent(a.id)}
              className={`text-left rounded-xl p-4 border ${selectedAgent === a.id ? "border-cyan-300 bg-cyan-500/10" : "border-white/15 bg-white/5"}`}
            >
              <p className="font-bold">{a.name}</p>
              <p className="text-xs text-slate-300">{a.model}</p>
              <p className="text-xs text-emerald-300 mt-1">{a.status}</p>
            </button>
          ))}
        </section>

        <section className="rounded-2xl border border-white/15 bg-white/5 p-5 space-y-3">
          <p className="text-sm text-slate-300">Prompt para o agente selecionado:</p>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full h-24 rounded-lg bg-slate-900 border border-slate-700 p-3" />
          <button onClick={runAgent} disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-400 text-slate-950 font-bold">
            {loading ? "Executando..." : "Executar agente"}
          </button>
          {output && <div className="rounded-lg bg-slate-900 border border-slate-700 p-3 text-sm">{output}</div>}
        </section>
      </div>
    </main>
  );
}
