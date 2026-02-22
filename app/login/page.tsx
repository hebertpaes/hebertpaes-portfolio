"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const socialProviders = [
  { key: "google", icon: "/icons/google.svg", name: "Google (Gmail)", className: "bg-white text-slate-900 hover:bg-slate-100 border border-slate-300" },
  { key: "apple", icon: "/icons/apple.svg", name: "Apple", className: "bg-black text-white hover:bg-neutral-900 border border-neutral-700" },
  { key: "microsoft", icon: "/icons/microsoft.svg", name: "Microsoft", className: "bg-sky-500 text-white hover:bg-sky-400 border border-sky-300/40" },
  { key: "github", icon: "/icons/github.svg", name: "GitHub", className: "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-700" },
  { key: "linkedin", icon: "/icons/linkedin.svg", name: "LinkedIn", className: "bg-blue-700 text-white hover:bg-blue-600 border border-blue-400/40" },
  { key: "whatsapp", icon: "/icons/whatsapp.svg", name: "WhatsApp", className: "bg-emerald-500 text-white hover:bg-emerald-400 border border-emerald-300/40" },
];

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"app" | "sms" | "email" | "">("");
  const [message, setMessage] = useState("");

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Preencha e-mail e senha.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setMessage("Informe seu nome para cadastro.");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("As senhas não coincidem.");
        return;
      }
      if (twoFactorRequired && !twoFactorMethod) {
        setMessage("2 fatores está obrigatório: selecione um método.");
        return;
      }

      setMessage(
        `Cadastro pronto para envio. 2FA obrigatório: ${twoFactorRequired ? "sim" : "não"}${
          twoFactorRequired ? ` (${twoFactorMethod})` : ""
        }.`
      );
      return;
    }

    setMessage("Login local validado. Para autenticação real, conecte backend OAuth.");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
      <div className="max-w-xl mx-auto bg-white/10 border border-white/15 rounded-2xl p-8">
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${mode === "login" ? "bg-cyan-400 text-slate-950" : "bg-white/10"}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${mode === "register" ? "bg-cyan-400 text-slate-950" : "bg-white/10"}`}
            onClick={() => setMode("register")}
            type="button"
          >
            Cadastro
          </button>
        </div>

        <h1 className="text-3xl font-black mb-3">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
        <p className="text-slate-300 mb-3">Acesso da área OpenClaw em hebertpaes.com.</p>
        {errorText && <p className="text-sm text-rose-300 mb-6">{errorText}</p>}

        <a
          href={githubUrl}
          className="w-full inline-flex items-center justify-center bg-black hover:bg-neutral-900 border border-neutral-700 text-white font-semibold rounded-xl px-4 py-3.5 mb-4 shadow-sm hover:shadow-md active:scale-[0.99] transition-all"
        >
          <img src="/icons/github.svg" alt="" className="w-5 h-5 mr-2.5" aria-hidden="true" />
          Continuar com GitHub
        </a>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {socialProviders.map((provider) => (
            <a
              key={provider.name}
              href={`/api/openclaw/auth?provider=${provider.key}&action=start`}
              className={`inline-flex items-center justify-center font-semibold rounded-xl px-4 py-3.5 text-sm shadow-sm hover:shadow-md active:scale-[0.99] transition-all ${provider.className}`}
            >
              <img src={provider.icon} alt="" className="w-5 h-5 mr-2.5" aria-hidden="true" />
              <span className="truncate">Cadastrar com {provider.name}</span>
            </a>
          ))}
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "register" && (
            <>
              <input
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
                placeholder="Confirmar senha"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={twoFactorRequired}
                  onChange={(e) => {
                    setTwoFactorRequired(e.target.checked);
                    if (!e.target.checked) setTwoFactorMethod("");
                  }}
                />
                Exigir autenticação em 2 fatores para esta conta
              </label>

              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3"
                value={twoFactorMethod}
                onChange={(e) => setTwoFactorMethod(e.target.value as "app" | "sms" | "email" | "")}
                disabled={!twoFactorRequired}
              >
                <option value="">Selecione o método de 2 fatores</option>
                <option value="app">Aplicativo autenticador (TOTP)</option>
                <option value="sms">SMS</option>
                <option value="email">Código por e-mail</option>
              </select>
            </>
          )}

          <button className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg px-4 py-3">
            {mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-amber-200">{message}</p>}

        <p className="mt-6 text-xs text-slate-400">
          Observação: provedores sociais e 2FA já preparados na interface. Para produção, conecte os apps OAuth e backend.
        </p>
      </div>
    </main>
  );
}
