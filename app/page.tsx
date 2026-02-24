const floatingBtnClass =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-white/20 backdrop-blur-sm";

const highlights = [
  {
    title: "Design mais limpo",
    description: "Layout reorganizado com foco no conteúdo principal e melhor leitura em mobile.",
  },
  {
    title: "Podcast em destaque",
    description: "Página dedicada para episódios, sem mistura com links de música.",
  },
  {
    title: "Loja em reformulação",
    description: "Sem imagens e sem produtos por enquanto, conforme solicitado.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.16),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.18),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.16),transparent_35%)]" />

      <section className="relative px-4 pt-24 pb-16 text-center">
        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-cyan-300 text-xs md:text-sm mb-5">Hebert Paes • Portfólio Oficial</p>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Visual premium,
            <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
              direto ao ponto
            </span>
          </h1>
          <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Página principal redesenhada com hierarquia visual melhor, navegação mais clara e experiência mais elegante
            em desktop e celular.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/podcast" className={`${floatingBtnClass} bg-violet-600 hover:bg-violet-700 px-8 py-3`}>
              Ver Podcast
            </a>
            <a href="#loja" className={`${floatingBtnClass} bg-amber-500/15 text-amber-100 hover:bg-amber-500/25 px-8 py-3`}>
              Status da Loja
            </a>
            <a href="#chat" className={`${floatingBtnClass} bg-cyan-600 hover:bg-cyan-700 px-8 py-3`}>
              Abrir Chat
            </a>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-300/30 hover:bg-white/[0.07] hover:-translate-y-1"
            >
              <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-200 transition-colors">{item.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="loja" className="relative px-4 py-16">
        <div className="max-w-5xl mx-auto rounded-3xl border border-amber-300/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-8 md:p-10 shadow-[0_20px_80px_rgba(245,158,11,0.12)]">
          <p className="uppercase tracking-[0.25em] text-amber-200 text-xs mb-3">Loja virtual</p>
          <h2 className="text-3xl md:text-4xl font-black mb-3">Loja temporariamente sem produtos</h2>
          <p className="text-amber-100/90">
            A seção da loja foi simplificada: sem imagens e sem produtos no momento. Em breve ela volta com nova
            curadoria e nova experiência de compra.
          </p>
        </div>
      </section>

      <section id="chat" className="relative px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-4xl font-bold">Chat Jabes</h2>
              <p className="text-slate-300 mt-2">Atendimento direto na página principal.</p>
            </div>
            <a href="/openclaw/chat" className={`${floatingBtnClass} bg-cyan-600 hover:bg-cyan-700 px-6 py-3`}>
              Abrir em tela cheia
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)] bg-black/20">
            <iframe src="/openclaw/chat" title="Chat Jabes" className="w-full h-[760px] bg-slate-950" loading="lazy" />
          </div>
        </div>
      </section>

      <section id="contact" className="relative px-4 py-16">
        <div className="max-w-4xl mx-auto text-center bg-white/[0.06] border border-white/10 rounded-2xl p-10 backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-4">Contato & Parcerias</h2>
          <p className="text-slate-300 mb-6">Para shows, publis e projetos digitais, fale com a equipe.</p>
          <a href="mailto:contato@hebertpaes.com" className="text-cyan-300 text-xl hover:text-cyan-200">
            contato@hebertpaes.com
          </a>
        </div>
      </section>

      <footer className="relative py-10 text-center text-slate-400 border-t border-white/10 mt-8">
        <p>© 2026 Hebert Paes. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
