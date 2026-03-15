"use client";

import { useState } from "react";

import ThemeToggle from "./components/theme-toggle";

const products = [
  {
    name: "Chat",
    href: "/chat",
    description: "Atendimento inteligente para conversas, suporte e automações com contexto.",
  },
  {
    name: "Notícias",
    href: "/noticias",
    description: "Conteúdo atualizado sobre tecnologia, IA e tendências de mercado.",
  },
  {
    name: "Cursos",
    href: "/cursos",
    description: "Formação prática para acelerar aprendizado em produto, dados e inteligência artificial.",
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    description: "Soluções, templates e recursos prontos para aplicar em negócios reais.",
  },
];

const pillars = [
  "Design limpo e legível",
  "Performance e estabilidade",
  "Experiência orientada a resultado",
  "Marca HebertPaes em primeiro plano",
];

const quickActions = [
  { name: "Abrir Chat", href: "/chat" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Entrar", href: "/dashboard" },
];

export default function HebertPaesHomepage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-160px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute right-[5%] top-[12%] h-[280px] w-[280px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-[8%] top-[38%] h-[220px] w-[220px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] shadow-sm">
              <span className="text-sm font-bold tracking-[0.15em]">HP</span>
            </div>
            <div>
              <div className="text-lg font-semibold">HebertPaes</div>
              <div className="text-xs text-[var(--text-primary)]/50">Tecnologia, IA e educação digital</div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-[var(--text-primary)]/70 md:flex">
            {products.map((item) => (
              <a key={item.name} href={item.href} className="transition hover:text-[var(--text-primary)]">
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/dashboard"
              className="hidden rounded-full border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-primary)]/80 transition hover:bg-[var(--bg-surface)] md:inline-flex"
            >
              Entrar
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-24 lg:pt-28">
          <div>
            <div className="inline-flex items-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-1 text-xs text-[var(--text-primary)]/70">
              Ecossistema digital HebertPaes
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Um hub moderno para construir, aprender e escalar com IA.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--text-primary)]/70 sm:text-lg">
              A homepage da HebertPaes foi redesenhada para ser objetiva, elegante e profissional, com navegação clara para os produtos principais e foco em conversão.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-7 shadow-xl shadow-black/10">
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
          </div>
        </section>

        <section className="border-y border-[var(--border-primary)] bg-[var(--bg-surface)]/60">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
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
                  <div className="text-xl font-semibold">{item.name}</div>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-primary)]/65">{item.description}</p>
                  <div className="mt-4 text-sm font-medium text-[var(--text-primary)]/80 group-hover:text-[var(--text-primary)]">Acessar →</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-6 right-6 z-40">
        {showPopup ? (
          <div className="mb-3 w-56 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)]/95 p-2 shadow-2xl backdrop-blur">
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
