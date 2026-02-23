"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 px-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white/10 border border-white/15 rounded-2xl p-8 backdrop-blur">
        <h1 className="text-3xl font-black text-white mb-2">Admin Login</h1>
        <p className="text-slate-300 mb-6">Acesso administrativo com validação em banco de dados.</p>

        <label className="block text-sm text-slate-300 mb-1">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
          placeholder="admin@hebertpaes.com"
        />

        <label className="block text-sm text-slate-300 mb-1">Senha</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
          placeholder="********"
        />

        {error && <p className="text-rose-300 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 text-slate-950 font-bold rounded-xl px-4 py-3.5 transition-all"
        >
          {loading ? "Entrando..." : "Entrar no Admin"}
        </button>
      </form>
    </main>
  );
}
