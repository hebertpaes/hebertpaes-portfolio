"use client";

import { useEffect, useMemo, useState } from "react";

const socialProviders = [
  { key: "google", icon: "/icons/google.svg", name: "Google (Gmail)", className: "bg-white text-slate-900 hover:bg-slate-100 border border-slate-300" },
];

export default function LoginPage() {
  const githubUrl = useMemo(() => "/api/openclaw/auth?provider=github&action=start", []);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get("error");
    if (!err) return;
    if (err === "auth_required") return setErrorText("Faça login para acessar os agentes.");
    if (err.endsWith("_not_configured")) return setErrorText("Provedor ainda não configurado. Tente outro login.");
    if (err.includes("oauth")) return setErrorText("Falha na autenticação OAuth. Tente novamente.");
    setErrorText("Não foi possível autenticar. Tente novamente.");
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
      <div className="max-w-xl mx-auto bg-white/10 border border-white/15 rounded-2xl p-8">
        <h1 className="text-3xl font-black mb-3">Entrar com e-mail</h1>
        <p className="text-slate-300 mb-3">Acesso da área OpenClaw em hebertpaes.com via provedores OAuth.</p>
        {errorText && <p className="text-sm text-rose-300 mb-6">{errorText}</p>}

        <a
          href={githubUrl}
          className="w-full inline-flex items-center justify-center bg-black hover:bg-neutral-900 border border-neutral-700 text-white font-semibold rounded-xl px-4 py-3.5 mb-4 shadow-sm hover:shadow-md active:scale-[0.99] transition-all"
        >
          <img src="/icons/github.svg" alt="" className="w-5 h-5 mr-2.5" aria-hidden="true" />
          Entrar (usuários existentes)
        </a>

        <p className="text-xs text-slate-300 mb-3">Novos usuários: cadastro exclusivamente via Google API.</p>

        <div className="grid sm:grid-cols-1 gap-3 mb-2">
          {socialProviders.map((provider) => (
            <a
              key={provider.name}
              href={`/api/openclaw/auth?provider=${provider.key}&action=start`}
              className={`inline-flex items-center justify-center font-semibold rounded-xl px-4 py-3.5 text-sm shadow-sm hover:shadow-md active:scale-[0.99] transition-all ${provider.className}`}
            >
              <img src={provider.icon} alt="" className="w-5 h-5 mr-2.5" aria-hidden="true" />
              <span className="truncate">Entrar com {provider.name}</span>
            </a>
          ))}
        </div>

        <p className="mt-6 text-xs text-slate-400">Autenticação principal por provedores com e-mail.</p>
      </div>
    </main>
  );
}
