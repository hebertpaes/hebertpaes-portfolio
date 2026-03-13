"use client";

import { useMemo, useState } from "react";

type Provider = "openai" | "claude" | "gemini" | "llama" | "mistral";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  provider?: Provider;
};

const providers: { id: Provider; label: string; models: string[]; gradient: string }[] = [
  {
    id: "openai",
    label: "OpenAI",
    models: ["GPT-4.1", "GPT-4o", "o3-mini"],
    gradient: "from-emerald-400/25 to-cyan-500/20",
  },
  {
    id: "claude",
    label: "Claude",
    models: ["Claude 3.7 Sonnet", "Claude 3.5 Haiku"],
    gradient: "from-purple-400/25 to-indigo-500/20",
  },
  {
    id: "gemini",
    label: "Gemini",
    models: ["Gemini 2.5 Pro", "Gemini Flash"],
    gradient: "from-sky-400/25 to-blue-500/20",
  },
  {
    id: "llama",
    label: "Llama",
    models: ["Llama 3.3 70B", "Llama 3.1 405B"],
    gradient: "from-orange-400/25 to-rose-500/20",
  },
  {
    id: "mistral",
    label: "Mistral",
    models: ["Mistral Large", "Mixtral 8x22B"],
    gradient: "from-yellow-400/25 to-amber-500/20",
  },
];

const platformCards = [
  {
    title: "Chat Multi-Modelo",
    description: "Orquestração entre provedores com roteamento inteligente por custo, latência e qualidade.",
    href: "/openclaw/chat",
  },
  {
    title: "Sistema de Cursos IA",
    description: "Trilhas práticas com checkout, comunidade e certificação para profissionais e equipes.",
    href: "/cursos",
  },
  {
    title: "Loja de Produtos Digitais",
    description: "Prompts premium, agentes, templates e automações de IA prontas para escalar seu negócio.",
    href: "/marketplace",
  },
  {
    title: "Dashboard do Usuário",
    description: "Painel completo com consumo de tokens, histórico, planos e desempenho por modelo.",
    href: "/dashboard",
  },
];

export default function HomePageClient() {
  const [selectedProvider, setSelectedProvider] = useState<Provider>("openai");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      provider: "openai",
      text: "Bem-vindo à hebertpaes.com IA Platform. Escolha um modelo e mande sua primeira pergunta.",
    },
  ]);

  const selected = useMemo(
    () => providers.find((provider) => provider.id === selectedProvider) ?? providers[0],
    [selectedProvider],
  );

  async function sendMessage() {
    if (!prompt.trim() || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: prompt.trim() }];
    setMessages(nextMessages);
    const currentPrompt = prompt.trim();
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/multimodel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: selectedProvider, prompt: currentPrompt }),
      });

      if (!res.ok) {
        throw new Error("Falha ao consultar a IA");
      }

      const data = (await res.json()) as { reply: string; provider: Provider };
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply, provider: data.provider }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          provider: selectedProvider,
          text: "Não foi possível responder agora. Tente novamente em instantes.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,.2),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(167,139,250,.2),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(52,211,153,.16),transparent_35%)]" />

      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-black tracking-[0.28em] text-cyan-300">HEBERTPAES.COM</p>
            <h1 className="text-2xl font-black sm:text-3xl">Maior Plataforma de IA no Brasil</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-xs font-bold sm:text-sm">
            <a href="/noticias" className="rounded-full border border-white/20 px-3 py-1.5 hover:bg-white/10">Notícias</a>
            <a href="/cursos" className="rounded-full border border-white/20 px-3 py-1.5 hover:bg-white/10">Cursos</a>
            <a href="/marketplace" className="rounded-full border border-white/20 px-3 py-1.5 hover:bg-white/10">Loja IA</a>
            <a href="/dashboard" className="rounded-full border border-cyan-300/60 bg-cyan-300/10 px-3 py-1.5 text-cyan-100 hover:bg-cyan-300/20">Dashboard</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-12">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">Ecossistema unificado de IA</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
            OpenAI, Claude, Gemini, Llama e Mistral em uma única experiência
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
            Plataforma completa para conversar com múltiplos modelos, estudar IA, comprar produtos digitais
            avançados e acompanhar tudo em um dashboard com métricas em tempo real.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {platformCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-white/15 bg-black/25 p-4 transition hover:border-cyan-300/60 hover:bg-black/40"
              >
                <h3 className="text-base font-extrabold">{card.title}</h3>
                <p className="mt-1 text-xs text-slate-300">{card.description}</p>
              </a>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-white/15 bg-black/40 p-4 shadow-2xl backdrop-blur sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black">Chat IA Integrado</h3>
            <span className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
              online
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {providers.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => setSelectedProvider(provider.id)}
                className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                  selectedProvider === provider.id
                    ? `border-cyan-300/60 bg-gradient-to-r ${provider.gradient}`
                    : "border-white/15 bg-white/5 hover:bg-white/10"
                }`}
              >
                <p className="font-extrabold">{provider.label}</p>
                <p className="mt-0.5 text-[10px] text-slate-300">{provider.models[0]}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 h-64 overflow-y-auto rounded-2xl border border-white/15 bg-[#050810] p-3">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[92%] rounded-xl px-3 py-2 text-xs ${
                    message.role === "user"
                      ? "ml-auto bg-cyan-400/20 text-cyan-50"
                      : "bg-white/10 text-slate-100"
                  }`}
                >
                  {message.provider && (
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-cyan-200">{message.provider}</p>
                  )}
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder={`Pergunte para ${selected.label}`}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400"
            />
            <button
              type="button"
              disabled={loading}
              onClick={sendMessage}
              className="rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950 disabled:opacity-60"
            >
              {loading ? "..." : "Enviar"}
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
