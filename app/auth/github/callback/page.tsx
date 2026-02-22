"use client";

import { useMemo } from "react";

export default function GitHubCallbackPage() {
  const details = useMemo(() => {
    if (typeof window === "undefined") return { code: "", state: "", error: "" };
    const params = new URLSearchParams(window.location.search);
    return {
      code: params.get("code") || "",
      state: params.get("state") || "",
      error: params.get("error") || "",
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
      <div className="max-w-2xl mx-auto bg-white/10 border border-white/15 rounded-2xl p-8">
        <h1 className="text-3xl font-black mb-3">GitHub Callback</h1>
        <p className="text-slate-300 mb-6">Retorno do OAuth recebido com sucesso.</p>

        {details.error ? (
          <p className="text-rose-300 mb-4">Erro no OAuth: {details.error}</p>
        ) : (
          <p className="text-emerald-300 mb-4">Código OAuth recebido.</p>
        )}

        <div className="space-y-2 text-sm">
          <p><strong>code:</strong> {details.code ? "recebido" : "não encontrado"}</p>
          <p><strong>state:</strong> {details.state || "(vazio)"}</p>
        </div>

        <p className="text-xs text-amber-200 mt-6">
          Próximo passo: trocar o `code` por token no backend seguro e criar sessão autenticada.
        </p>
      </div>
    </main>
  );
}
