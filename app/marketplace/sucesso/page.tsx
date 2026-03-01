"use client";

export default function MarketplaceSuccessPage() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const orderRef = params.get("orderRef") || "--";
  const itemId = params.get("itemId") || "--";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-14 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Pedido criado</p>
        <h1 className="mt-3 text-4xl font-black">Marketplace ativo</h1>
        <p className="mt-3 text-slate-300">Seu pedido foi registrado com sucesso. Nossa equipe seguirá o fluxo de confirmação.</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-left text-sm">
          <p><strong>Pedido:</strong> {orderRef}</p>
          <p><strong>Item:</strong> {itemId}</p>
        </div>

        <a href="/marketplace" className="mt-6 inline-flex rounded-xl border border-white/20 bg-cyan-500 px-5 py-2.5 font-bold text-slate-950 hover:bg-cyan-400">
          Voltar ao marketplace
        </a>
      </div>
    </main>
  );
}
