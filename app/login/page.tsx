"use client";

import { useEffect, useMemo, useState } from "react";

const socialProviders = [
  { key: "google", icon: "/icons/google.svg", name: "Google (Gmail)", className: "bg-white text-slate-900 hover:bg-slate-100 border border-slate-300" },
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
    if (err === "auth_required") return setErrorText("Faça login para acessar os agentes.");
    if (err.endsWith("_not_configured")) return setErrorText("Provedor ainda não configurado. Tente outro login.");
    if (err.includes("oauth")) return setErrorText("Falha na autenticação OAuth. Tente novamente.");
    setErrorText("Não foi possível autenticar. Tente novamente.");
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-3 py-6 text-white sm:px-4 sm:py-10 md:py-16">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 sm:p-6 md:p-8">
        <h1 className="mb-2 text-2xl font-black leading-tight sm:mb-3 sm:text-3xl">Entrar com e-mail</h1>
        <p className="mb-3 text-sm text-slate-300 sm:text-base">Acesso da área OpenClaw em hebertpaes.com via provedores OAuth.</p>
        {errorText && <p className="mb-4 text-sm text-rose-300 sm:mb-6">{errorText}</p>}

        <a
          href={githubUrl}
          className="mb-3 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-neutral-700 bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-900 hover:shadow-md active:scale-[0.99] sm:mb-4 sm:text-base"
        >
          <img src="/icons/github.svg" alt="" className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="text-center">Entrar (usuários existentes)</span>
        </a>

        <p className="mb-3 text-xs text-slate-300 sm:text-sm">Novos usuários: cadastro exclusivamente via Google API.</p>

        <div className="mb-2 grid gap-3">
          {socialProviders.map((provider) => (
            <a
              key={provider.name}
              href={`/api/openclaw/auth?provider=${provider.key}&action=start${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`}
              className={`inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-all hover:shadow-md active:scale-[0.99] sm:text-base ${provider.className}`}
            >
              <img src={provider.icon} alt="" className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="text-center">Entrar com {provider.name}</span>
            </a>
          ))}
        </div>

        <p className="mt-5 text-xs text-slate-400 sm:mt-6">Autenticação principal por provedores com e-mail.</p>
      </div>
    </main>
  );
}
