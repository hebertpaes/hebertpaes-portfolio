"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setError(data?.error || "Falha no login");
        return;
      }

      window.location.href = data.next || "/admin/dashboard";
    } catch {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_86%_8%,rgba(168,85,247,0.16),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.12),transparent_30%)]" />

      <form onSubmit={submit} className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/[0.06] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-cyan-200">Área restrita</p>
        <h1 className="mb-2 text-3xl font-black">Admin Login</h1>
        <p className="mb-6 text-slate-300">Acesso administrativo com validação no banco de dados.</p>

        <label className="mb-1 block text-sm text-slate-300">E-mail</label>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition-all focus:border-cyan-300/60"
          placeholder="admin@hebertpaes.com"
        />

        <label className="mb-1 block text-sm text-slate-300">Senha</label>
        <div className="mb-4 flex gap-2">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition-all focus:border-cyan-300/60"
            placeholder="********"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="rounded-xl border border-white/20 px-3 text-sm text-slate-200 hover:bg-white/10"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>

        {error && <p className="mb-3 text-sm text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl border border-white/20 bg-cyan-400 px-4 py-3.5 font-bold text-slate-950 transition-all hover:bg-cyan-300 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar no Admin"}
        </button>

        <a href="/login" className="mt-4 inline-block text-sm text-cyan-200 hover:text-cyan-100">
          Voltar para login geral
        </a>
      </form>
    </main>
  );
}
