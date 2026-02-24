"use client";

import { useEffect, useState } from "react";

type Episode = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  link: string;
};

const fallbackEpisodes: Episode[] = [
  {
    id: "ep1",
    title: "Automação prática para negócios locais",
    summary: "Como automatizar processos de atendimento sem perder qualidade.",
    duration: "22 min",
    link: "#",
  },
  {
    id: "ep2",
    title: "Execução sem enrolação",
    summary: "Framework simples para sair do planejamento e entrar em produção.",
    duration: "27 min",
    link: "#",
  },
  {
    id: "ep3",
    title: "Produto, vendas e consistência",
    summary: "Estratégias para manter ritmo de entrega com foco em resultado.",
    duration: "30 min",
    link: "#",
  },
];

export default function PodcastPage() {
  const [episodes, setEpisodes] = useState<Episode[]>(fallbackEpisodes);

  useEffect(() => {
    fetch("/api/prototype/podcast")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.episodes) && d.episodes.length) setEpisodes(d.episodes);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-violet-300 text-sm mb-4">hebertpaes.com/podcast</p>
        <h1 className="text-5xl md:text-6xl font-black mb-6">Podcast de Hebert Paes</h1>
        <p className="text-slate-300 max-w-3xl mb-10">
          Episódios sobre tecnologia, automação, produto e execução. Conteúdo direto, prático e atualizado.
        </p>

        <section className="grid md:grid-cols-3 gap-4 mb-10">
          {episodes.map((episode) => (
            <article key={episode.id} className="bg-white/10 border border-white/10 rounded-2xl p-5">
              <p className="text-violet-200 text-xs mb-2">{episode.duration}</p>
              <h2 className="font-bold text-xl mb-2">{episode.title}</h2>
              <p className="text-slate-300 text-sm mb-4">{episode.summary}</p>
              <span className="inline-block bg-violet-500/25 text-violet-100 px-4 py-2 rounded-lg text-sm font-semibold">
                Episódio disponível em breve
              </span>
            </article>
          ))}
        </section>

        <a href="/" className="text-violet-200 hover:text-violet-100 underline">
          ← Voltar para home
        </a>
      </div>
    </main>
  );
}
