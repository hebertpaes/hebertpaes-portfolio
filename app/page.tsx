"use client";

import { useState } from "react";

import ThemeToggle from "./components/theme-toggle";

const products = [
  {
    name: "Chat",
    href: "/chat",
    tag: "Atendimento",
    description: "Atendimento inteligente para conversas, suporte e automações com contexto.",
  },
  {
    name: "Instituto",
    href: "/instituto",
    tag: "Projeto social",
    description: "Estudo arquitetônico 3D para educação, saúde pública e impacto regional em Várzea Grande.",
  },
  {
    name: "Notícias",
    href: "/noticias",
    tag: "Conteúdo",
    description: "Conteúdo atualizado sobre tecnologia, IA e tendências de mercado.",
  },
  {
    name: "Cursos",
    href: "/cursos",
    tag: "Formação",
    description: "Formação prática para acelerar aprendizado em produto, dados e inteligência artificial.",
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    tag: "Soluções",
    description: "Soluções, templates e recursos prontos para aplicar em negócios reais.",
  },
  {
    name: "OpenClaw",
    href: "/openclaw",
    tag: "Automação",
    description: "Central de agentes, sessões e automações para operar processos digitais com IA.",
  },
];

const pillars = [
  "Design limpo e legível",
  "Performance e estabilidade",
  "Experiência orientada a resultado",
  "Marca HebertPaes em primeiro plano",
];

const stats = [
  { value: "6", label: "áreas principais integradas" },
  { value: "24h", label: "hub preparado para operação digital" },
  { value: "IA", label: "como camada estratégica do ecossistema" },
];

const quickActions = [
  { name: "Abrir Chat", href: "/chat" },
  { name: "Ver Instituto", href: "/instituto" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Entrar", href: "/dashboard" },
];

export default function HebertPaesHomepage() {
  const [showPopup, setShowPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-160px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute right-[5%] top-[12%] h-[280px] w-[280px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-[8%] top-[38%] h-[220px] w-[220px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex min-w-0 items-center gap-3" aria-label="HebertPaes — início">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] shadow-sm">
              <span className="text-sm font-bold tracking-[0.15em]">HP</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold">HebertPaes</div>
              <div className="hidden text-xs text-[var(--text-primary)]/50 sm:block">Tecnologia, IA e educação digital</div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-[var(--text-primary)]/70 lg:flex" aria-label="Navegação principal">
            {products.slice(0, 5).map((item) => (
              <a key={item.name} href={item.href} className="transition hover:text-[var(--text-primary)]">
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <a
              href="/dashboard"
              className="hidden rounded-full border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-primary)]/80 transition hover:bg-[var(--bg-surface)] md:inline-flex"
            >
              Entrar
            </a>
            <button
              type="button"
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] text-lg lg:hidden"
              aria-expanded={showMobileMenu}
              aria-label="Abrir menu"
            >
              {showMobileMenu ? "×" : "☰"}
            </button>
          </div>
        </div>

        {showMobileMenu ? (
          <nav className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)] px-5 py-4 lg:hidden" aria-label="Menu mobile">
            <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2">
              {products.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="rounded-2xl border border-[var(--text-primary)]/20 bg-[var(--text-primary)] px-4 py-3 text-sm font-semibold text-[var(--bg-primary)]"
              >
                Entrar na área restrita
              </a>
            </div>
          </nav>
        ) : null}
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-24 lg:pt-28">
          <div>
            <div className="inline-flex items-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-1 text-xs text-[var(--text-primary)]/70">
              Ecossistema digital HebertPaes
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Um hub moderno para construir, aprender e escalar com IA.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--text-primary)]/70 sm:text-lg">
              A plataforma reúne comunicação, atendimento, cursos, marketplace, notícias, projetos institucionais e automações em uma experiência limpa, responsiva e preparada para conversão.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/chat"
                className="inline-flex items-center justify-center rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-semibold text-[var(--bg-primary)] shadow-lg transition hover:scale-[1.01]"
              >
                Começar pelo Chat
              </a>
              <a
                href="/instituto"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--text-primary)]/35"
              >
                Ver projeto Instituto
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4">
                  <div className="text-2xl font-semibold">{item.value}</div>
                  <div className="mt-1 text-xs leading-5 text-[var(--text-primary)]/60">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 shadow-xl shadow-black/10 sm:p-7">
            <div className="text-sm font-medium text-[var(--text-primary)]/60">Diretrizes da experiência</div>
            <ul className="mt-5 space-y-3">
              {pillars.map((pillar) => (
                <li
                  key={pillar}
                  className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)]/80"
                >
                  {pillar}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-4 text-sm leading-6 text-[var(--text-primary)]/75">
              Interface pensada para abrir rápido no celular, guiar o visitante e manter uma presença profissional em todos os pontos de contato.
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--border-primary)] bg-[var(--bg-surface)]/60">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-primary)]/50">Produtos</div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Tudo em um só lugar para acelerar resultados.</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--text-primary)]/35"
                >
                  <div className="text-xs uppercase tracking-[0.16em] text-[var(--text-primary)]/45">{item.tag}</div>
                  <div className="mt-3 text-xl font-semibold">{item.name}</div>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-primary)]/65">{item.description}</p>
                  <div className="mt-4 text-sm font-medium text-[var(--text-primary)]/80 group-hover:text-[var(--text-primary)]">Acessar →</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-[2rem] border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-primary)]/50">Próximo passo</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">Entre pelo canal certo e avance com clareza.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-primary)]/65">
                Use o chat para atendimento imediato, explore o Instituto para projetos de impacto ou acesse o marketplace para soluções prontas.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <a href="/chat" className="inline-flex items-center justify-center rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-[var(--bg-primary)]">
                Falar agora
              </a>
              <a href="/marketplace" className="inline-flex items-center justify-center rounded-full border border-[var(--border-primary)] px-5 py-3 text-sm font-semibold">
                Ver soluções
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-primary)] px-5 py-8 text-sm text-[var(--text-primary)]/55 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} HebertPaes. Tecnologia, IA e educação digital.</div>
          <div className="flex gap-4">
            <a href="/noticias" className="hover:text-[var(--text-primary)]">Notícias</a>
            <a href="/podcast" className="hover:text-[var(--text-primary)]">Podcast</a>
            <a href="/login" className="hover:text-[var(--text-primary)]">Login</a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
        {showPopup ? (
          <div className="mb-3 w-60 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)]/95 p-2 shadow-2xl backdrop-blur">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-[var(--text-primary)]/85 transition hover:bg-[var(--bg-muted)]"
              >
                {action.name}
              </a>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setShowPopup((prev) => !prev)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--text-primary)] text-xl font-bold text-[var(--bg-primary)] shadow-xl transition hover:scale-105"
          aria-label="Abrir ações rápidas"
        >
          {showPopup ? "×" : "+"}
        </button>
      </div>
    </div>
  );
}
