"use client";

import { useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  creator: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  students: string;
  price: string;
  category: string;
  accent: string;
};

const categories = ["Todos", "Negócios", "Marketing", "IA", "Vendas", "Conteúdo", "Tráfego"];

const courses: Course[] = [
  {
    id: "c1",
    title: "Máquina de Vendas com IA",
    creator: "Hebert Paes",
    level: "Intermediário",
    duration: "12h 40m",
    students: "2.9k alunos",
    price: "R$ 697",
    category: "IA",
    accent: "from-cyan-400/80 to-blue-500/80",
  },
  {
    id: "c2",
    title: "Conteúdo Magnético para Redes",
    creator: "Hebert Paes",
    level: "Iniciante",
    duration: "8h 10m",
    students: "4.2k alunos",
    price: "R$ 397",
    category: "Conteúdo",
    accent: "from-fuchsia-400/80 to-violet-500/80",
  },
  {
    id: "c3",
    title: "Tráfego Pago de Alta Conversão",
    creator: "Time HP Academy",
    level: "Avançado",
    duration: "16h 20m",
    students: "1.6k alunos",
    price: "R$ 997",
    category: "Tráfego",
    accent: "from-amber-300/80 to-orange-500/80",
  },
  {
    id: "c4",
    title: "Escala de Negócios Digitais",
    creator: "Hebert Paes",
    level: "Intermediário",
    duration: "10h 05m",
    students: "1.2k alunos",
    price: "R$ 597",
    category: "Negócios",
    accent: "from-emerald-300/80 to-teal-500/80",
  },
];

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
    name: "Pro Streaming",
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

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "Todos") return courses;
    return courses.filter((course) => course.category === selectedCategory);
  }, [selectedCategory]);

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
                  estilo Netflix + Prime + Disney
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
                <div className={`h-36 bg-gradient-to-br ${course.accent}`} />
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
                    <button className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/15">
                      Ver curso
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="recursos" className="relative px-4 py-14">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/15 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-bold">Recursos de vendas e monetização (estilo Hotmart)</h2>
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
