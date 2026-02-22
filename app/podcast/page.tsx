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
  { id: "ep1", title: "Hebert Paes", summary: "Conteúdo em áudio disponível nas plataformas.", duration: "28 min", link: "https://music.youtube.com/playlist?list=OLAK5uy_mDljpGt6-_TCOS9EX1nG7RvQrDTsXJX0k&si=Ys2ZA9hDhSX45ukt" },
  { id: "ep2", title: "Hebert Paes", summary: "Conteúdo em áudio disponível nas plataformas.", duration: "34 min", link: "https://open.spotify.com/search/hebert%20paes" },
  { id: "ep3", title: "Hebert Paes", summary: "Conteúdo em áudio disponível nas plataformas.", duration: "31 min", link: "https://music.apple.com/br/search?term=hebert%20paes" },
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 text-white px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-violet-300 text-sm mb-4">hebertpaes.com/podcast</p>
        <h1 className="text-5xl md:text-6xl font-black mb-6">Podcast de Hebert Paes</h1>
        <p className="text-gray-300 max-w-3xl mb-10">
          Episódios sobre tecnologia, automação, produto e execução. Conteúdo direto, prático e atualizado.
        </p>

        <section className="grid md:grid-cols-3 gap-4 mb-10">
          {episodes.map((episode) => (
            <article key={episode.id} className="bg-white/10 border border-white/10 rounded-2xl p-5">
              <p className="text-violet-200 text-xs mb-2">{episode.duration}</p>
              <h2 className="font-bold text-xl mb-2">{episode.title}</h2>
              <p className="text-gray-300 text-sm mb-4">{episode.summary}</p>
              <a href={episode.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-violet-500 hover:bg-violet-400 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Ouvir episódio
              </a>
            </article>
          ))}
        </section>

        <a href="/" className="text-violet-200 hover:text-violet-100 underline">← Voltar para home</a>
      </div>
    </main>
  );
}
