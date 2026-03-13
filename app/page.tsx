"use client";

import ThemeToggle from "./components/theme-toggle";

export default function HebertPaesYouStyleHomepage() {
  const logos = ["OpenAI", "Azure", "Anthropic", "Google Cloud", "AWS", "Meta", "Vercel", "Notion"];

  const features = [
    {
      title: "Busca em tempo real",
      text: "Resultados atualizados, estruturados e prontos para fluxos com IA, automação e RAG.",
    },
    {
      title: "Infra pronta para agentes",
      text: "Arquitetura pensada para apps modernos com respostas contextuais, rápidas e confiáveis.",
    },
    {
      title: "Personalização por domínio",
      text: "Organize fontes, índices e experiências sob a marca HebertPaes.",
    },
  ];

  const stats = [
    { value: "300ms", label: "latência p99 simulada" },
    { value: "10M+", label: "fontes indexadas" },
    { value: "99.99%", label: "uptime conceitual" },
  ];

  const cards = [
    {
      eyebrow: "API",
      title: "Search API",
      text: "Integre pesquisa atualizada ao seu stack e devolva respostas com contexto e precisão.",
    },
    {
      eyebrow: "Índices verticais",
      title: "Vertical Index",
      text: "Crie camadas especializadas para mídia, jurídico, saúde, varejo e fluxos próprios.",
    },
    {
      eyebrow: "Enterprise",
      title: "Solutions",
      text: "Entregue experiências com IA para times, clientes e operações críticas.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[8%] top-[20%] h-[260px] w-[260px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute left-[6%] top-[34%] h-[220px] w-[220px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-[var(--bg-surface)]/70 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
              <span className="text-sm font-semibold tracking-[0.2em]">HP</span>
            </div>
            <div>
              <div className="text-lg font-semibold">HebertPaes</div>
              <div className="text-xs text-[var(--text-primary)]/45">AI Search Infrastructure</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-[var(--text-primary)]/70 md:flex">
            <a href="/chat" className="transition hover:text-[var(--text-primary)]">Chat</a>
            <a href="/ai-platform" className="transition hover:text-[var(--text-primary)]">AI Platform</a>
            <a href="/noticias" className="transition hover:text-[var(--text-primary)]">Notícias</a>
            <a href="/cursos" className="transition hover:text-[var(--text-primary)]">Cursos</a>
            <a href="/marketplace" className="transition hover:text-[var(--text-primary)]">Marketplace</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="/dashboard" className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-[var(--text-primary)]/80 transition hover:bg-[var(--bg-surface)]/70 md:inline-flex">Entrar</a>
            <a href="/ai-platform" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:scale-[1.02]">Começar</a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Construa a camada de IA da sua marca com <span className="bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">HebertPaes</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-[var(--text-primary)]/70 sm:text-lg">
              Um homepage em estilo enterprise, com visual premium, foco em busca com IA, APIs, índices verticais e conversão comercial.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="/ai-platform" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]">Ver plataforma</a>
              <a href="/cursos" className="rounded-full border border-white/15 bg-[var(--bg-surface)]/70 px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/10">Ver cursos</a>
            </div>
          </div>

          <div className="mt-16 rounded-[28px] border border-[var(--border-primary)] bg-[var(--bg-surface)]/70 p-4 shadow-2xl shadow-cyan-900/10 backdrop-blur-xl sm:p-6 lg:p-8">
            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-[24px] border border-[var(--border-primary)] bg-[#0b1020] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[var(--text-primary)]/50">Painel principal</div>
                    <div className="text-xl font-semibold">HebertPaes Search Console</div>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">Online</div>
                </div>
                <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-muted)] p-4">
                  <div className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--text-primary)]/40">Prompt</div>
                  <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4 text-sm text-[var(--text-primary)]/80">
                    “Buscar informações confiáveis em tempo real para respostas com contexto, citações e velocidade.”
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {features.map((feature) => (
                      <div key={feature.title} className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)]/70 p-4">
                        <div className="text-sm font-medium">{feature.title}</div>
                        <div className="mt-2 text-sm leading-6 text-[var(--text-primary)]/60">{feature.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[24px] border border-[var(--border-primary)] bg-[var(--bg-surface)]/70 p-6 backdrop-blur-xl">
                    <div className="text-3xl font-semibold">{stat.value}</div>
                    <div className="mt-2 text-sm text-[var(--text-primary)]/55">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--border-primary)] bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 text-center text-sm text-[var(--text-primary)]/45 sm:grid-cols-4 lg:grid-cols-8">
              {logos.map((logo) => (
                <div key={logo} className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">{logo}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="produtos" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">Produtos</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">APIs e índices pensados para LLMs.</h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {cards.map((card) => (
              <div key={card.title} className="rounded-[28px] border border-[var(--border-primary)] bg-gradient-to-b from-white/8 to-white/[0.03] p-7 shadow-xl shadow-black/20">
                <div className="text-sm text-cyan-200/80">{card.eyebrow}</div>
                <h3 className="mt-3 text-2xl font-semibold">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--text-primary)]/65">{card.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
