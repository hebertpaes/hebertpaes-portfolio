const resources = [
  {
    title: "Agents",
    description: "Painel de agentes, sessões e contexto operacional.",
    href: "/openclaw/agents",
    cta: "Abrir Agents",
  },
  {
    title: "Sessões",
    description: "Conversas ativas, histórico e continuidade de execução.",
    href: "/openclaw/sessions",
    cta: "Ver sessões",
  },
  {
    title: "Automações",
    description: "Rotinas, tarefas recorrentes e checklists proativos.",
    href: "/openclaw/automations",
    cta: "Ver automações",
  },
  {
    title: "Status & Segurança",
    description: "Saúde do ambiente, auditorias e diagnósticos rápidos.",
    href: "/openclaw/status",
    cta: "Abrir status",
  },
];

export default function OpenClawPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-cyan-300 text-xs md:text-sm mb-4">hebertpaes.com/openclaw</p>

        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            OpenClaw Hub
            <span className="block text-cyan-300 mt-2">Recursos organizados em um só lugar</span>
          </h1>
          <a
            href="/login"
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all"
          >
            Login do usuário
          </a>
        </div>

        <p className="text-base md:text-xl text-slate-300 max-w-4xl mb-10">
          Central de operação com acesso a agentes, sessões, automações e status da plataforma.
        </p>

        <section className="grid md:grid-cols-2 gap-4 mb-10">
          {resources.map((item) => (
            <article key={item.title} className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="font-bold text-xl mb-2">{item.title}</h2>
              <p className="text-slate-300 text-sm mb-4">{item.description}</p>
              <a href={item.href} className="inline-block border border-cyan-300 text-cyan-200 hover:bg-cyan-500/10 font-semibold px-4 py-2 rounded-lg transition-all">
                {item.cta}
              </a>
            </article>
          ))}
        </section>

        <section className="flex flex-wrap gap-3">
          <a
            href="/openclaw/chat"
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all"
          >
            Abrir Chat
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
          <a href="mailto:contato@hebertpaes.com" className="border border-white/30 hover:bg-white/10 px-5 py-3 rounded-xl font-semibold transition-all">
            Falar com Hebert
          </a>
        </section>
      </div>
    </main>
  );
}
