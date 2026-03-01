"use client";

import { useEffect, useMemo, useState } from "react";
import AIGuideWidget from "@/app/components/ai-guide-widget";

type Item = {
  id: string;
  type: "produto" | "servico";
  title: string;
  description: string;
  priceLabel: string;
  category: string;
  imageUrl?: string;
};

const imageByItemId: Record<string, string> = {
  p1: "/illustrations/mk-p1.svg",
  p2: "/illustrations/mk-p2.svg",
  s1: "/illustrations/mk-s1.svg",
  s2: "/illustrations/mk-s2.svg",
};

export default function MarketplacePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [activeType, setActiveType] = useState<"todos" | "produto" | "servico">("todos");
  const [interest, setInterest] = useState("negocios");

  useEffect(() => {
    const query = activeType === "todos" ? "" : `?type=${activeType}`;
    fetch(`/api/marketplace/items${query}`)
      .then((r) => r.json())
      .then((d) => setItems(d?.items || []))
      .catch(() => setItems([]));
  }, [activeType]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("ai_interest") : null;
    if (stored) setInterest(stored);
    if (typeof window !== "undefined") localStorage.setItem("last_section", "marketplace");
  }, []);

  const stats = useMemo(() => {
    const produtos = items.filter((i) => i.type === "produto").length;
    const servicos = items.filter((i) => i.type === "servico").length;
    return { produtos, servicos, total: items.length };
  }, [items]);

  const nextBestItem = useMemo(() => {
    const preferredCategory =
      interest === "ia" ? "IA" : interest === "vendas" ? "Vendas" : interest === "conteudo" ? "Conteúdo" : interest === "trafego" ? "Tráfego" : interest === "marketing" ? "Marketing" : "Negócios";
    return items.find((i) => i.category === preferredCategory) || items[0];
  }, [items, interest]);

  const alsoLikeItems = useMemo(() => items.filter((i) => i.id !== nextBestItem?.id).slice(0, 3), [items, nextBestItem]);

  return (
    <main className="min-h-screen bg-[#04060f] px-4 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200">
          Marketplace • Produtos & Serviços
        </p>
        <h1 className="text-5xl font-black leading-[0.95] md:text-6xl">
          Ecossistema de ofertas
          <span className="block bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-transparent">
            dentro do hebertpaes.com
          </span>
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Venda produtos digitais e serviços premium no mesmo sistema, com checkout e gestão centralizada.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">Total: <strong>{stats.total}</strong></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">Produtos: <strong>{stats.produtos}</strong></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">Serviços: <strong>{stats.servicos}</strong></div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { key: "todos", label: "Todos" },
            { key: "produto", label: "Produtos" },
            { key: "servico", label: "Serviços" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveType(tab.key as "todos" | "produto" | "servico")}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                activeType === tab.key ? "border-cyan-300/70 bg-cyan-300/20 text-cyan-100" : "border-white/20 bg-white/5 text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
              <img src={item.imageUrl || imageByItemId[item.id] || "/illustrations/mk-p1.svg"} alt={item.title} className="mb-3 h-36 w-full rounded-2xl object-cover" loading="lazy" />
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{item.type} • {item.category}</p>
              <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-2xl font-black text-cyan-200">{item.priceLabel}</p>
                <a href={`/marketplace/checkout?itemId=${item.id}`} className="rounded-xl border border-white/20 bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500">
                  Comprar
                </a>
              </div>
            </article>
          ))}
          {items.length === 0 && <p className="text-slate-300">Nenhum item encontrado.</p>}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Próximo melhor produto/serviço</p>
          <h3 className="mt-2 text-2xl font-bold">{nextBestItem?.title || "Recomendação em preparação"}</h3>
          <p className="mt-1 text-sm text-slate-300">Sugestão baseada no seu interesse atual ({interest}).</p>
          {nextBestItem && (
            <a href={`/marketplace/checkout?itemId=${nextBestItem.id}`} className="mt-4 inline-flex rounded-xl border border-white/20 bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
              Abrir recomendação
            </a>
          )}

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold">Você também pode gostar</p>
            <div className="grid gap-3 md:grid-cols-3">
              {alsoLikeItems.map((item) => (
                <a key={item.id} href={`/marketplace/checkout?itemId=${item.id}`} className="rounded-2xl border border-white/10 bg-black/20 p-3 hover:bg-black/30">
                  <p className="text-xs text-slate-300">{item.category}</p>
                  <p className="font-semibold">{item.title}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AIGuideWidget source="marketplace" />
        </div>
      </div>
    </main>
  );
}
