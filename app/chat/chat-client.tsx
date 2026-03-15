"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "../components/theme-toggle";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatClient() {
  const [model, setModel] = useState("openai");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Olá! Sou o agente IA do hebertpaes.com. Como posso ajudar?" },
  ]);

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
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
        <header className="flex items-center justify-between rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4">
          <div>
            <h1 className="text-2xl font-black">HebertPaes AI Chat</h1>
            <p className="text-sm text-[var(--text-secondary)]">Modo dark/light com voz integrada para todos os modelos.</p>
          </div>
          <ThemeToggle />
        </header>

        <section className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-muted)] p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-[var(--text-secondary)]">Modelo:</span>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2 py-1">
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
              <option value="gemini">Gemini</option>
              <option value="llama">Llama</option>
              <option value="mistral">Mistral</option>
            </select>

            <span className="ml-2 text-[var(--text-secondary)]">Voz:</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="max-w-[220px] rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2 py-1"
            >
              {voices.length === 0 && <option value="">Voz padrão</option>}
              {voices.map((v) => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>

          <div className="h-[55vh] space-y-3 overflow-y-auto rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-3">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-xl bg-cyan-500/20 p-3" : "max-w-[85%] rounded-xl bg-[var(--bg-muted)] p-3"}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Digite sua mensagem..."
              className="min-w-[260px] flex-1 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={startVoiceInput}
              disabled={isListening}
              className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {isListening ? "Ouvindo..." : "🎤 Voz"}
            </button>
            <button
              type="button"
              onClick={speakLastAssistant}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black"
            >
              🔊 Ouvir
            </button>
            <button onClick={send} disabled={loading} className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-black disabled:opacity-60">
              {loading ? "..." : "Enviar"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
