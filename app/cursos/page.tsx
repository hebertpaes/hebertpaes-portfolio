"use client";

import { useEffect, useMemo, useState } from "react";
import { courses } from "@/lib/cursos-data";
import AIGuideWidget from "@/app/components/ai-guide-widget";

const categories = ["Todos", "Negócios", "Marketing", "IA", "Vendas", "Conteúdo", "Tráfego"];

const features = [
  "Área de membros com streaming em qualidade adaptativa",
  "Checkout e upsell com modelo semelhante aos melhores infoprodutos",
  "Programa de afiliados com comissões e links rastreáveis",
  "Cupons, order bump e assinatura recorrente",
  "Dashboard de métricas de vendas e retenção",
  "Proteção anti-pirataria com controle de acesso por sessão",
];

const plans = [
  {
    name: "Creator",
    price: "9,9% por venda",
    subtitle: "Para começar rápido",
    items: ["Checkout inteligente", "Área de membros", "1 produto"],
    highlight: false,
  },
  {
    name: "Pro Scale",
    price: "R$ 297/mês + 4,9%",
    subtitle: "Para escala com equipe",
    items: ["Produtos ilimitados", "Afiliados", "Automação de funis", "Analytics avançado"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    subtitle: "Para operação high-ticket",
    items: ["SLA dedicado", "Domínio white-label", "Integrações customizadas"],
    highlight: false,
  },
];

export default function CursosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [interest, setInterest] = useState("negocios");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("ai_interest") : null;
    if (stored) setInterest(stored);
    if (typeof window !== "undefined") localStorage.setItem("last_section", "cursos");
  }, []);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "Todos") return courses;
    return courses.filter((course) => course.category === selectedCategory);
  }, [selectedCategory]);

  const nextBestCourse = useMemo(() => {
    const preferredCategory =
      interest === "ia" ? "IA" : interest === "vendas" ? "Vendas" : interest === "conteudo" ? "Conteúdo" : interest === "trafego" ? "Tráfego" : interest === "marketing" ? "Marketing" : "Negócios";
    return courses.find((c) => c.category === preferredCategory) || courses[0];
  }, [interest]);

  const alsoLikeCourses = useMemo(() => courses.filter((c) => c.id !== nextBestCourse?.id).slice(0, 3), [nextBestCourse]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04060f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.25),transparent_38%),radial-gradient(circle_at_85%_8%,rgba(168,85,247,0.22),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.16),transparent_30%)]" />

      <section className="relative px-4 pt-20 pb-14">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
            HebertPaes.com/cursos • Streaming Academy
          </p>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="text-5xl font-black leading-[0.95] md:text-7xl">
                Portal SaaS de cursos
                <span className="block bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  experiência premium de plataforma de vídeo
                </span>
              </h1>
              <p className="mt-6 max-w-3xl text-base text-slate-300 md:text-xl">
                Uma experiência premium para consumir aulas em vídeo e vender infoprodutos com estrutura robusta de
                checkout, afiliados, recorrência e recursos de creator economy semelhantes aos grandes players do
                mercado digital.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#catalogo" className="rounded-2xl border border-white/20 bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-400">
                  Explorar catálogo
                </a>
                <a href="#planos" className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold hover:bg-white/15">
                  Ver planos de venda
                </a>
                <a href="#recursos" className="rounded-2xl border border-white/20 bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500">
                  Recursos de creator
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Painel de vendas</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                  <p className="text-2xl font-black text-cyan-200">R$ 128k</p>
                  <p className="text-xs text-slate-300">MRR</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                  <p className="text-2xl font-black text-violet-200">8.3%</p>
                  <p className="text-xs text-slate-300">Conversão</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                  <p className="text-2xl font-black text-emerald-200">312</p>
                  <p className="text-xs text-slate-300">Afiliados</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">Módulo administrativo com funis, cupons, assinaturas e recuperação de carrinho.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="relative px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-bold">Catálogo em estilo stream</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                    selectedCategory === category
                      ? "border-cyan-300/70 bg-cyan-300/20 text-cyan-100"
                      : "border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <article key={course.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-cyan-200/40">
                <img src={course.imageUrl} alt={course.title} className="h-36 w-full object-cover" loading="lazy" />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-300">{course.category}</p>
                  <h3 className="mt-2 text-lg font-bold leading-tight text-white group-hover:text-cyan-100">{course.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">por {course.creator}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1">{course.level}</span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1">{course.duration}</span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1">{course.students}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-black text-cyan-200">{course.price}</p>
                    <a href={`/cursos/${course.id}`} className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/15">
                      Ver curso
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="recursos" className="relative px-4 py-14">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/15 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-bold">Recursos de vendas e monetização para infoprodutos</h2>
          <p className="mt-2 max-w-3xl text-slate-300">
            Estrutura completa para creators, experts e equipes comerciais venderem cursos, mentorias e assinaturas com
            controle total da operação.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {features.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
                • {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-8">
        <div className="mx-auto max-w-7xl">
          <AIGuideWidget source="cursos" />
        </div>
      </section>

      <section className="relative px-4 pb-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Próximo melhor curso</p>
          <h3 className="mt-2 text-2xl font-bold">{nextBestCourse?.title}</h3>
          <p className="mt-1 text-sm text-slate-300">Recomendado com base no seu interesse atual ({interest}).</p>
          <a href={`/cursos/${nextBestCourse?.id}`} className="mt-4 inline-flex rounded-xl border border-white/20 bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
            Abrir recomendação
          </a>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold">Você também pode gostar</p>
            <div className="grid gap-3 md:grid-cols-3">
              {alsoLikeCourses.map((course) => (
                <a key={course.id} href={`/cursos/${course.id}`} className="rounded-2xl border border-white/10 bg-black/20 p-3 hover:bg-black/30">
                  <p className="text-xs text-slate-300">{course.category}</p>
                  <p className="font-semibold">{course.title}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="relative px-4 pb-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">Planos SaaS para creators e escolas</h2>
          <p className="mt-2 text-slate-300">Escolha o plano ideal para lançar e escalar seus cursos com experiência premium.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-3xl border p-6 backdrop-blur-xl ${
                  plan.highlight
                    ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_20px_80px_rgba(6,182,212,0.2)]"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{plan.name}</p>
                <p className="mt-2 text-3xl font-black text-white">{plan.price}</p>
                <p className="mt-1 text-sm text-slate-300">{plan.subtitle}</p>

                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  {plan.items.map((item) => (
                    <p key={item}>• {item}</p>
                  ))}
                </div>

                <button className="mt-6 w-full rounded-2xl border border-white/20 bg-white/10 py-2.5 font-semibold hover:bg-white/15">
                  Começar agora
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
