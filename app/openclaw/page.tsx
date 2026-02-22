export default function OpenClawPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-cyan-300 text-xs md:text-sm mb-4">hebertpaes.com/openclaw</p>

        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">OpenClaw by Hebert Paes</h1>

        <p className="text-base md:text-xl text-slate-300 max-w-3xl mb-10">
          Página atualizada com foco em automação pessoal, agentes inteligentes e integração multi-canal.
        </p>

        <section className="grid md:grid-cols-3 gap-4 mb-10">
          <article className="bg-white/10 border border-white/15 rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-2">Automação</h2>
            <p className="text-slate-300 text-sm">Tarefas recorrentes, verificações de rotina e fluxos com contexto persistente.</p>
          </article>

          <article className="bg-white/10 border border-white/15 rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-2">Assistência IA</h2>
            <p className="text-slate-300 text-sm">Agentes com memória, execução de comandos e suporte a ferramentas em tempo real.</p>
          </article>

          <article className="bg-white/10 border border-white/15 rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-2">Integrações</h2>
            <p className="text-slate-300 text-sm">Conexão com webchat e outros canais para centralizar comunicação e operações.</p>
          </article>
        </section>

        <div className="flex gap-3 flex-wrap">
          <a
            href="https://docs.openclaw.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-5 py-3 rounded-xl"
          >
            Ver documentação
          </a>
          <a
            href="https://github.com/openclaw/openclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-cyan-300 text-cyan-200 hover:bg-cyan-500/10 font-semibold px-5 py-3 rounded-xl"
          >
            Repositório no GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
