"use client";

import Image from "next/image";
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
    category: "POLÍTICA",
    title: "Congresso acelera agenda fiscal e redesenha o ambiente de negócios para 2026",
    excerpt:
      "Leitura estratégica com dados, contexto e bastidores para quem decide investimento e crescimento.",
    meta: "Atualizado há 8 min",
  },
  {
    category: "MUNDO",
    title: "Nova arquitetura geopolítica pressiona cadeias globais e comércio internacional",
    excerpt:
      "Análise de impacto para empresas brasileiras em importação, câmbio e competitividade.",
    meta: "Atualizado há 19 min",
  },
  {
    category: "TECNOLOGIA",
    title: "IA editorial entra na fase de escala e redefine redações de alta performance",
    excerpt:
      "Como organizações de mídia unem apuração humana, automação e personalização em tempo real.",
    meta: "Atualizado há 31 min",
  },
];

const opinion = [
  "Editorial: credibilidade é ativo de longo prazo",
  "Entrevista: o novo jogo da influência digital",
  "Especial: mercados emergentes em 2026",
  "Análise: como dados mudam o ciclo da notícia",
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
    <main className="min-h-screen bg-[#f5f7fa] text-[#0f172a]">
      <div className="h-1 w-full bg-gradient-to-r from-[#b10017] via-[#cc1f36] to-[#0d2a56]" />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.24em] text-[#b10017]">GLOBAL PRESS</p>
              <h1 className="text-3xl font-black tracking-tight">Edição Profissional</h1>
            </div>
            <p className="hidden rounded-full border border-slate-300 px-3 py-1 text-xs font-bold text-slate-600 md:block">
              LIVE • Última atualização em tempo real
            </p>
          </div>

          <nav aria-label="Navegação principal" className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200 pt-3 text-sm font-bold text-slate-700">
            <a href="/" className="hover:text-black">Home</a>
            <a href="/podcast" className="hover:text-black">Podcast</a>
            <a href="/cursos" className="hover:text-black">Cursos</a>
            <a href="/marketplace" className="hover:text-black">Marketplace</a>
            <a href="/openclaw/chat" className="hover:text-black">Chat</a>
            <a href="/login" className="hover:text-black">Login</a>
            <a href="/admin/login" className="hover:text-black">Admin</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.4fr_0.95fr] lg:px-8 lg:py-10">
        <article className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-[#0b162b] px-6 py-5 text-white sm:px-8 sm:py-7">
            <p className="inline-flex rounded-full bg-[#b10017] px-3 py-1 text-[11px] font-extrabold tracking-wide">
              CAPA • REPORTAGEM PRINCIPAL
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Um visual editorial de elite: moderno, limpo e agressivo em hierarquia de informação
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
              Projeto com estética de grandes redações internacionais: tipografia forte, grid de notícias,
              contraste premium e leitura orientada por prioridade editorial.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:p-8 md:grid-cols-2">
            {topStories.slice(0, 2).map((story) => (
              <article key={story.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-extrabold tracking-wide text-[#b10017]">{story.category}</p>
                <h3 className="mt-2 text-lg font-extrabold leading-snug">{story.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{story.excerpt}</p>
                <p className="mt-3 text-xs font-semibold text-slate-500">{story.meta}</p>
              </article>
            ))}
          </div>
        </article>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-black">Acesso do assinante</h3>
            <p className="mt-1 text-sm text-slate-600">
              Faça login para liberar conteúdos exclusivos, newsletters e personalização da capa.
            </p>

            {errorText && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorText}</p>}

            <a
              href={githubUrl}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-[#0b162b] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#091124]"
            >
              <Image src="/icons/github.svg" alt="" width={20} height={20} className="h-5 w-5 shrink-0" aria-hidden="true" />
              Entrar (usuários existentes)
            </a>

            <div className="mt-3 grid gap-3">
              {socialProviders.map((provider) => (
                <a
                  key={provider.name}
                  href={`/api/openclaw/auth?provider=${provider.key}&action=start${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`}
                  className={`inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold transition ${provider.className}`}
                >
                  <Image src={provider.icon} alt="" width={20} height={20} className="h-5 w-5 shrink-0" aria-hidden="true" />
                  Entrar com {provider.name}
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-base font-black">Opinião & Análises</h3>
            <ul className="mt-3 space-y-2">
              {opinion.map((item) => (
                <li key={item} className="text-sm font-semibold text-slate-700">
                  • {item}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between border-b border-slate-300 pb-3">
          <h3 className="text-2xl font-black">Últimas notícias</h3>
          <a href="/podcast" className="text-sm font-extrabold text-[#b10017] hover:text-[#8f0012]">Ver cobertura completa</a>
        </div>

        <article className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-extrabold tracking-wide text-[#b10017]">{topStories[2].category}</p>
          <h4 className="mt-2 text-2xl font-black leading-snug">{topStories[2].title}</h4>
          <p className="mt-2 text-sm text-slate-600">{topStories[2].excerpt}</p>
          <p className="mt-3 text-xs font-semibold text-slate-500">{topStories[2].meta}</p>
        </article>
      </section>
    </main>
  );
}
