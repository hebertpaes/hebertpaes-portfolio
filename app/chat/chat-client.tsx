"use client";

import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "../components/theme-toggle";

type Provider = "openai" | "claude" | "gemini" | "llama" | "mistral";
type Msg = { role: "user" | "assistant"; text: string };

const providerLabel: Record<Provider, string> = {
  openai: "OpenAI",
  claude: "Claude",
  gemini: "Gemini",
  llama: "Llama",
  mistral: "Mistral",
};

export default function ChatClient() {
  const [model, setModel] = useState<Provider>("openai");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Olá! Sou o assistente HebertPaes. Como posso ajudar hoje?" },
  ]);

  const suggestions = useMemo(
    () => [
      "Crie um plano de estudos de IA para 30 dias",
      "Escreva um post sobre automação para negócios locais",
      "Monte uma estratégia de lançamento para curso online",
      "Resuma as principais notícias de tecnologia da semana",
    ],
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      if (!selectedVoice && list.length) {
        const pt = list.find((v) => v.lang.toLowerCase().startsWith("pt"));
        setSelectedVoice((pt || list[0]).name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  async function send(textArg?: string) {
    const finalText = (textArg ?? input).trim();
    if (!finalText || loading) return;

    if (!textArg) setInput("");
    setMessages((prev) => [...prev, { role: "user", text: finalText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalText, model }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || "Sem resposta no momento." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Erro temporário. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  }

  function startVoiceInput() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Reconhecimento de voz não suportado neste navegador." }]);
      return;
    }

    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || "";
      if (!transcript) return;
      setInput(String(transcript).trim());
    };

    recognition.start();
  }

  function speakLastAssistant() {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant?.text || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(lastAssistant.text);
    utterance.lang = "pt-BR";

    const picked = voices.find((v) => v.name === selectedVoice);
    if (picked) utterance.voice = picked;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r border-[var(--border-primary)] bg-[var(--bg-surface)] p-4">
          <button
            type="button"
            onClick={() => setMessages([{ role: "assistant", text: "Nova conversa iniciada. Como posso ajudar?" }])}
            className="mb-4 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-left text-sm font-medium hover:bg-[var(--bg-muted)]"
          >
            + Nova conversa
          </button>

          <div className="space-y-2">
            <div className="rounded-lg bg-[var(--bg-primary)] px-3 py-2 text-sm">Planejamento de curso</div>
            <div className="rounded-lg bg-[var(--bg-primary)] px-3 py-2 text-sm">Estratégia de vendas</div>
            <div className="rounded-lg bg-[var(--bg-primary)] px-3 py-2 text-sm">Resumo de notícias</div>
          </div>
        </aside>

        <section className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-[var(--border-primary)] px-4 py-3">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">HebertPaes Chat</h1>
              <span className="rounded-full border border-[var(--border-primary)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                {providerLabel[model]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as Provider)}
                className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2 py-1 text-sm"
              >
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
                <option value="llama">Llama</option>
                <option value="mistral">Mistral</option>
              </select>
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            {messages.length <= 1 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Como posso ajudar hoje?</h2>
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-3 text-left text-sm hover:bg-[var(--bg-muted)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={`${m.role}-${i}`} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                      m.role === "user"
                        ? "bg-cyan-500/20"
                        : "border border-[var(--border-primary)] bg-[var(--bg-surface)]"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-sm text-[var(--text-secondary)]">Gerando resposta...</div>
              )}
            </div>
          </div>

          <footer className="border-t border-[var(--border-primary)] p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="max-w-[230px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2 py-1 text-xs"
              >
                {voices.length === 0 && <option value="">Voz padrão</option>}
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </select>
              <button
                type="button"
                onClick={startVoiceInput}
                disabled={isListening}
                className="rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {isListening ? "Ouvindo..." : "🎤 Falar"}
              </button>
              <button
                type="button"
                onClick={speakLastAssistant}
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black"
              >
                🔊 Ouvir resposta
              </button>
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Pergunte qualquer coisa..."
                className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-black disabled:opacity-60"
              >
                Enviar
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
