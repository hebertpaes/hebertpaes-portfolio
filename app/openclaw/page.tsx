const pillars = [
  {
    title: "Assistente Proativo",
    description:
      "Um agente pessoal que acompanha contexto, lembra tarefas importantes e ajuda a executar o que realmente importa.",
  },
  {
    title: "Automação com Contexto",
    description:
      "Fluxos inteligentes para rotina, projetos e monitoramento — sem perder histórico nem rastreabilidade.",
  },
  {
    title: "Integração Real",
    description:
      "Conexão com webchat, ferramentas e canais para transformar conversa em ação de verdade.",
  },
];

const useCases = [
  "Centralizar tarefas e decisões do dia a dia",
  "Automatizar deploys, validações e checks técnicos",
  "Criar rotinas de follow-up com memória persistente",
  "Operar projetos com velocidade e governança",
];

export default function OpenClawPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-cyan-300 text-xs md:text-sm mb-4">hebertpaes.com/openclaw</p>

        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
          OpenClaw por Hebert Paes
          <span className="block text-cyan-300 mt-2">Automação pessoal + IA operacional</span>
        </h1>

        <p className="text-base md:text-xl text-slate-300 max-w-4xl mb-3">
          Esta página reúne como estou usando OpenClaw para acelerar execução, organizar contexto e transformar pedidos em entregas reais com velocidade.
        </p>
        <p className="text-xs md:text-sm text-amber-200/90 mb-10">
          O botão de chat local funciona no MacBook com OpenClaw ativo (endereço 127.0.0.1).
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {pillars.map((item) => (
            <article key={item.title} className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="font-bold text-lg mb-2">{item.title}</h2>
              <p className="text-slate-300 text-sm">{item.description}</p>
            </article>
          ))}
        </div>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Aplicações práticas</h2>
          <ul className="grid md:grid-cols-2 gap-3 text-slate-200">
            {useCases.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-cyan-300 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-wrap gap-3">
          <a
            href="http://127.0.0.1:18789/chat?session=agent%3Acodex%3Acodex"
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all"
          >
            Abrir chat do agente (MacBook)
          </a>
          <a
            href="https://docs.openclaw.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all"
          >
            Documentação OpenClaw
          </a>
          <a
            href="https://github.com/openclaw/openclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-cyan-300 text-cyan-200 hover:bg-cyan-500/10 font-semibold px-5 py-3 rounded-xl transition-all"
          >
            Open-source no GitHub
          </a>
          <a href="mailto:contact@hebertpaes.com" className="border border-white/30 hover:bg-white/10 px-5 py-3 rounded-xl font-semibold transition-all">
            Falar com Hebert
          </a>
        </section>
      </div>
    </main>
  );
}
