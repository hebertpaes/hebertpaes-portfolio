"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatPage() {
  const [model, setModel] = useState("openai");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Olá! Sou o agente IA do hebertpaes.com. Como posso ajudar?" },
  ]);

  async function send() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, model }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || "Sem resposta no momento." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Erro temporário. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
        <header className="rounded-2xl border border-white/10 bg-[#111827] p-4">
          <h1 className="text-2xl font-black">OpenClaw AI Chat</h1>
          <p className="text-sm text-slate-300">Modo escuro estilo OpenClaw com agente integrado em hebertpaes.com/chat</p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="text-slate-300">Modelo:</span>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="rounded-lg border border-white/20 bg-[#111827] px-2 py-1">
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
              <option value="gemini">Gemini</option>
              <option value="llama">Llama</option>
              <option value="mistral">Mistral</option>
            </select>
          </div>

          <div className="h-[55vh] space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-[#020617] p-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-xl bg-cyan-500/20 p-3" : "max-w-[85%] rounded-xl bg-white/10 p-3"}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Digite sua mensagem..."
              className="w-full rounded-xl border border-white/20 bg-[#111827] px-3 py-2 text-sm"
            />
            <button onClick={send} disabled={loading} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-black disabled:opacity-60">
              {loading ? "..." : "Enviar"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
