"use client";

import { useState } from "react";

type Mode = "search" | "chat" | "imagine" | "code" | "write" | "agents" | "research";

const modes: { id: Mode; label: string; endpoint: string }[] = [
  { id: "search", label: "YouSearch", endpoint: "/api/ai/search" },
  { id: "chat", label: "YouChat", endpoint: "/api/ai/chat" },
  { id: "imagine", label: "YouImagine", endpoint: "/api/ai/imagine" },
  { id: "code", label: "YouCode", endpoint: "/api/ai/code" },
  { id: "write", label: "YouWrite", endpoint: "/api/ai/write" },
  { id: "agents", label: "Agents", endpoint: "/api/ai/agents" },
  { id: "research", label: "Realtime", endpoint: "/api/ai/research" },
];

export default function AiPlatformClient() {
  const [mode, setMode] = useState<Mode>("search");
  const [input, setInput] = useState("Tendências de IA para 2026");
  const [result, setResult] = useState<string>("Pronto para executar.");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const current = modes.find((m) => m.id === mode)!;
      const bodyByMode: Record<Mode, Record<string, string>> = {
        search: { query: input, model: "openai" },
        chat: { prompt: input, model: "claude" },
        imagine: { prompt: input, model: "openai" },
        code: { task: input, model: "gemini", language: "typescript" },
        write: { brief: input, model: "mistral", tone: "premium" },
        agents: { name: "Agent Custom", systemPrompt: input, preferredModel: "openai" },
        research: { topic: input },
      };

      const method = mode === "agents" ? "POST" : "POST";
      const res = await fetch(current.endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyByMode[mode]),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch {
      setResult("Erro ao executar modo selecionado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050913] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-black tracking-[0.28em] text-cyan-300">HEBERTPAES AI MODES</p>
          <h1 className="mt-2 text-3xl font-black">Interface avançada estilo You com todos os modos</h1>
          <p className="mt-2 text-sm text-slate-300">Implementação própria inspirada em experiência multi-modo: Search, Chat, Imagine, Code, Write, Agents e Realtime Sources.</p>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-extrabold">Modos</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-xl border px-3 py-2 text-sm font-bold ${
                    mode === m.id ? "border-cyan-300 bg-cyan-300/15" : "border-white/15 bg-black/20"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-4 h-40 w-full rounded-xl border border-white/15 bg-black/30 p-3 text-sm"
            />

            <button
              onClick={run}
              disabled={loading}
              className="mt-3 w-full rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 disabled:opacity-50"
            >
              {loading ? "Executando..." : `Executar ${modes.find((m) => m.id === mode)?.label}`}
            </button>
          </aside>

          <article className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <h2 className="text-lg font-extrabold">Resposta da API</h2>
            <pre className="mt-3 h-[460px] overflow-auto rounded-xl border border-white/10 bg-[#02050c] p-3 text-xs text-cyan-100">
              {result}
            </pre>
          </article>
        </section>
      </div>
    </main>
  );
}
