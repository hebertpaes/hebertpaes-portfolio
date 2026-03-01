"use client";

import { FormEvent, useState } from "react";

export default function Admin2FAPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        const msg = data?.error;
        if (msg === "totp_not_configured") setError("2FA ainda não configurado no servidor.");
        else if (msg === "not_allowed") setError("Sua conta não está autorizada para super admin.");
        else if (msg === "invalid_code") setError("Código 2FA inválido.");
        else setError("Não foi possível validar o 2FA.");
        return;
      }

      window.location.href = data.next || "/admin/dashboard";
    } catch {
      setError("Erro de conexão ao validar 2FA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_90%_5%,rgba(168,85,247,0.16),transparent_33%)]" />

      <form onSubmit={submit} className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/[0.06] p-8 backdrop-blur-xl">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-cyan-200">Super Admin</p>
        <h1 className="mb-2 text-3xl font-black">Validação 2 fatores</h1>
        <p className="mb-6 text-slate-300">Digite o código de 6 dígitos do seu autenticador para entrar sem senha local.</p>

        <label className="mb-1 block text-sm text-slate-300">Código 2FA</label>
        <input
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="mb-4 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-300/60"
          placeholder="000000"
          required
        />

        {error && <p className="mb-3 text-sm text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl border border-white/20 bg-cyan-400 px-4 py-3.5 font-bold text-slate-950 transition-all hover:bg-cyan-300 disabled:opacity-60"
        >
          {loading ? "Validando..." : "Entrar como super admin"}
        </button>

        <a href="/admin/login" className="mt-4 inline-block text-sm text-cyan-200 hover:text-cyan-100">
          Voltar para login admin
        </a>
      </form>
    </main>
  );
}
