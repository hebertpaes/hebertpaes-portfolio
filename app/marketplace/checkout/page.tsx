"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  type: "produto" | "servico";
  title: string;
  description: string;
  priceLabel: string;
  category: string;
};

export default function MarketplaceCheckoutPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const itemId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("itemId") || "";
  }, []);

  useEffect(() => {
    fetch("/api/marketplace/items")
      .then((r) => r.json())
      .then((d) => setItems(d?.items || []))
      .catch(() => setItems([]));
  }, []);

  const item = items.find((i) => i.id === itemId);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/marketplace/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage("Não foi possível iniciar o pedido.");
        return;
      }

      window.location.href = data.next;
    } catch {
      setMessage("Erro de conexão no checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">Item não encontrado.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050913] px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
        <h1 className="text-3xl font-black">Checkout Marketplace</h1>
        <p className="mt-2 text-slate-300">{item.title} • {item.priceLabel}</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp (opcional)" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" />

          <button type="submit" disabled={loading} className="w-full rounded-xl border border-white/20 bg-cyan-500 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60">
            {loading ? "Processando..." : "Finalizar pedido"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-rose-300">{message}</p>}
      </div>
    </main>
  );
}
