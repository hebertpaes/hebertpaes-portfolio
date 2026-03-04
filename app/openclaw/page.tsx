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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-3 py-6 text-white sm:px-4 sm:py-10 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-cyan-300 sm:mb-4 sm:text-xs sm:tracking-[0.3em] md:text-sm">hebertpaes.com/openclaw</p>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
            OpenClaw Hub
            <span className="block text-cyan-300 mt-2">Recursos organizados em um só lugar</span>
          </h1>
          <a
            href="/login"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-300 sm:w-auto sm:px-5 sm:py-3 sm:text-base"
          >
            Login do usuário
          </a>
        </div>

        <p className="mb-8 max-w-4xl text-sm text-slate-300 sm:text-base md:mb-10 md:text-xl">
          Central de operação com acesso a agentes, sessões, automações e status da plataforma.
        </p>

        <div className="mb-6">
          <a href="/openclaw/app" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-300 sm:w-auto sm:px-5 sm:py-3 sm:text-base">
            Abrir app (protótipo)
          </a>
        </div>

        <section className="mb-8 grid gap-3 sm:gap-4 md:mb-10 md:grid-cols-2">
          {resources.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
              <h2 className="mb-2 text-lg font-bold sm:text-xl">{item.title}</h2>
              <p className="mb-4 text-sm text-slate-300">{item.description}</p>
              <a href={item.href} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-cyan-300 px-4 py-2 text-sm font-semibold text-cyan-200 transition-all hover:bg-cyan-500/10">
                {item.cta}
              </a>
            </article>
          ))}
        </section>

        <section className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <a
            href="/openclaw/chat"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-300 sm:px-5 sm:py-3 sm:text-base"
          >
            Abrir Chat
          </a>
          <a
            href="https://docs.openclaw.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 sm:px-5 sm:py-3 sm:text-base"
          >
            Documentação OpenClaw
          </a>
          <a
            href="https://github.com/openclaw/openclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-all hover:bg-cyan-500/10 sm:px-5 sm:py-3 sm:text-base"
          >
            Open-source no GitHub
          </a>
          <a href="mailto:contato@hebertpaes.com" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold transition-all hover:bg-white/10 sm:px-5 sm:py-3 sm:text-base">
            Falar com Hebert
          </a>
        </section>
      </div>
    </main>
  );
}
