"use client";

import { useEffect, useMemo, useState } from "react";

const socialProviders = [
  {
    key: "google",
    icon: "/icons/google.svg",
    name: "Google (Gmail)",
    className: "bg-white text-slate-900 hover:bg-slate-100 border border-slate-300",
  },
];

const topStories = [
  {
    category: "Política",
    title: "Plano fiscal avança e muda cenário para investimentos no segundo semestre",
    excerpt:
      "Análise de bastidores com impacto direto no mercado, no consumo e na confiança de empresários.",
    meta: "Atualizado há 12 min",
  },
  {
    category: "Economia",
    title: "Inflação desacelera acima do esperado e pressiona decisões do Banco Central",
    excerpt:
      "Especialistas apontam novas oportunidades para crédito, renda fixa e expansão de negócios.",
    meta: "Atualizado há 21 min",
  },
  {
    category: "Tecnologia",
    title: "IA generativa redefine rotinas em redações e acelera produção multimídia",
    excerpt:
      "Times editoriais adotam fluxos híbridos entre jornalistas, analistas de dados e automação.",
    meta: "Atualizado há 34 min",
  },
];

const highlights = [
  "Cobertura em tempo real",
  "Análises exclusivas de especialistas",
  "Entrevistas e opinião",
  "Mercado, política e tecnologia",
];

export default function LoginPage() {
  const [errorText, setErrorText] = useState("");
  const [nextPath, setNextPath] = useState("");

  const githubUrl = useMemo(() => {
    const base = "/api/openclaw/auth?provider=github&action=start";
    return nextPath ? `${base}&next=${encodeURIComponent(nextPath)}` : base;
  }, [nextPath]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    const next = params.get("next") || "";
    setNextPath(next);

    if (!err) return;
    if (err === "auth_required") return setErrorText("Faça login para acessar conteúdo premium e sua área personalizada.");
    if (err.endsWith("_not_configured")) return setErrorText("Provedor ainda não configurado. Tente outro login.");
    if (err.includes("oauth")) return setErrorText("Falha na autenticação OAuth. Tente novamente.");
    setErrorText("Não foi possível autenticar. Tente novamente.");
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-red-600">NEWSROOM PRO</p>
            <h1 className="text-2xl font-black sm:text-3xl">Portal Global</h1>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            <a href="#" className="hover:text-black">Início</a>
            <a href="#" className="hover:text-black">Brasil</a>
            <a href="#" className="hover:text-black">Mundo</a>
            <a href="#" className="hover:text-black">Negócios</a>
            <a href="#" className="hover:text-black">Tech</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.45fr_1fr] lg:px-8 lg:py-10">
        <article className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white sm:p-8">
          <p className="mb-3 inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide">
            Destaque do dia
          </p>
          <h2 className="text-2xl font-black leading-tight sm:text-4xl">
            Jornalismo premium com design moderno, leitura elegante e foco total em credibilidade
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
            Estrutura editorial inspirada nos maiores portais globais, com seções estratégicas,
            chamadas claras e experiência totalmente responsiva para desktop, tablet e mobile.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
            {highlights.map((item) => (
              <span key={item} className="rounded-full border border-white/25 px-3 py-1">
                {item}
              </span>
            ))}
          </div>
        </article>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-extrabold">Acesso do assinante</h3>
          <p className="mt-1 text-sm text-slate-600">
            Entre para personalizar sua capa, salvar artigos e acompanhar newsletters exclusivas.
          </p>

          {errorText && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorText}</p>}

          <a
            href={githubUrl}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            <img src="/icons/github.svg" alt="" className="h-5 w-5 shrink-0" aria-hidden="true" />
            Entrar (usuários existentes)
          </a>

          <div className="mt-3 grid gap-3">
            {socialProviders.map((provider) => (
              <a
                key={provider.name}
                href={`/api/openclaw/auth?provider=${provider.key}&action=start${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`}
                className={`inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition ${provider.className}`}
              >
                <img src={provider.icon} alt="" className="h-5 w-5 shrink-0" aria-hidden="true" />
                Entrar com {provider.name}
              </a>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between border-b border-slate-300 pb-3">
          <h3 className="text-2xl font-black">Últimas notícias</h3>
          <a href="#" className="text-sm font-bold text-red-600 hover:text-red-700">
            Ver tudo
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {topStories.map((story) => (
            <article key={story.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-red-600">{story.category}</p>
              <h4 className="mt-2 text-lg font-extrabold leading-snug">{story.title}</h4>
              <p className="mt-2 text-sm text-slate-600">{story.excerpt}</p>
              <p className="mt-3 text-xs font-medium text-slate-500">{story.meta}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
