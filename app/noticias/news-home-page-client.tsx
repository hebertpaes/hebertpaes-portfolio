"use client";

import Image from "next/image";
import ThemeToggle from "../components/theme-toggle";

const headlines = [
  {
    category: "POLÍTICA",
    title: "Reforma administrativa entra na fase final e promete impacto direto em serviços e investimentos",
    excerpt:
      "Entenda os pontos-chave em discussão, os impactos fiscais e como o mercado está reagindo ao novo texto.",
    href: "/login",
  },
  {
    category: "ECONOMIA",
    title: "Cenário de juros abre janela para expansão de negócios digitais no segundo semestre",
    excerpt:
      "Analistas destacam setores com maior potencial de crescimento e os riscos que ainda precisam de atenção.",
    href: "/marketplace",
  },
  {
    category: "TECNOLOGIA",
    title: "Empresas aceleram adoção de IA com foco em produtividade, atendimento e receita",
    excerpt:
      "Mapa das estratégias usadas por operações modernas para escalar resultados sem perder qualidade.",
    href: "/cursos",
  },
];

const quickLinks = [
  { label: "Últimas", href: "/login" },
  { label: "Podcast", href: "/podcast" },
  { label: "Análises", href: "/cursos" },
  { label: "Negócios", href: "/marketplace" },
  { label: "Admin", href: "/admin/login" },
];

export default function NewsHomePageClient() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#a4001a] via-[#c81f36] to-[#0f2b58]" />

      <header className="border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.22em] text-[#a4001a]">HEBERTPAES.COM</p>
              <h1 className="text-3xl font-black tracking-tight">Blog de Notícias</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a href="/login" className="rounded-full border border-[var(--border-primary)] px-3 py-1 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]">
                Edição ao vivo
              </a>
            </div>
          </div>

          <nav aria-label="Editorias" className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--border-primary)] pt-3 text-sm font-bold text-[var(--text-secondary)]">
            {quickLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-black">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.45fr_0.95fr] lg:px-8 lg:py-10">
        <article className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] shadow-sm">
          <div className="relative h-64 sm:h-80">
            <Image
              src="/illustrations/mk-p1.svg"
              alt="Imagem destaque da editoria principal"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-[11px] font-extrabold tracking-wide text-[#a4001a]">CAPA • DESTAQUE</p>
            <h2 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
              Jornalismo digital com estética premium, navegação clara e leitura orientada por relevância
            </h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)] sm:text-base">
              Estrutura editorial moderna inspirada nos grandes portais globais, com foco em performance,
              credibilidade e experiência mobile-first.
            </p>
            <a href="/login" className="mt-5 inline-flex rounded-xl bg-[#0f2b58] px-4 py-2 text-sm font-bold text-white hover:bg-[#0b2348]">
              Ler reportagem completa
            </a>
          </div>
        </article>

        <aside className="space-y-4">
          {headlines.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5 shadow-sm">
              <p className="text-[11px] font-extrabold tracking-wide text-[#a4001a]">{item.category}</p>
              <h3 className="mt-2 text-lg font-extrabold leading-snug">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.excerpt}</p>
              <a href={item.href} className="mt-3 inline-flex text-sm font-bold text-[#0f2b58] hover:text-[#0b2348]">
                Continuar lendo
              </a>
            </article>
          ))}
        </aside>
      </section>
    </main>
  );
}
