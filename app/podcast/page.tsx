const episodes = [
  {
    title: "Automação pessoal com IA na prática",
    summary: "Como organizar rotina e execução com agentes sem perder controle.",
    duration: "28 min",
  },
  {
    title: "Build, deploy e observabilidade sem dor",
    summary: "Estratégias para acelerar entrega com segurança e previsibilidade.",
    duration: "34 min",
  },
  {
    title: "Produto, conteúdo e escala",
    summary: "Como unir tecnologia e posicionamento para crescer com consistência.",
    duration: "31 min",
  },
];

export default function PodcastPage() {
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
            <article key={episode.title} className="bg-white/10 border border-white/10 rounded-2xl p-5">
              <p className="text-violet-200 text-xs mb-2">{episode.duration}</p>
              <h2 className="font-bold text-xl mb-2">{episode.title}</h2>
              <p className="text-gray-300 text-sm mb-4">{episode.summary}</p>
              <button className="bg-violet-500 hover:bg-violet-400 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Ouvir episódio
              </button>
            </article>
          ))}
        </section>

        <a href="/" className="text-violet-200 hover:text-violet-100 underline">← Voltar para home</a>
      </div>
    </main>
  );
}
