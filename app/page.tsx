const products = [
  {
    name: "Camiseta Oficial Hebert Paes",
    description: "Malha premium, estampa exclusiva e edição limitada.",
    price: "R$ 89,90",
    tag: "Mais vendido",
  },
  {
    name: "Boné Signature HP",
    description: "Boné ajustável com bordado frontal e acabamento premium.",
    price: "R$ 69,90",
    tag: "Novo",
  },
  {
    name: "Caneca Studio Session",
    description: "Caneca de cerâmica 350ml para acompanhar sua playlist.",
    price: "R$ 49,90",
    tag: "Oferta",
  },
  {
    name: "Pack Digital Wallpapers + Capa",
    description: "Kit digital com artes exclusivas para celular e desktop.",
    price: "R$ 19,90",
    tag: "Digital",
  },
];

const streamingPlatforms = [
  {
    name: "Spotify",
    link: "https://open.spotify.com/search/hebert%20paes%20falcao",
  },
  {
    name: "Apple Music",
    link: "https://music.apple.com/br/search?term=hebert%20paes%20falcao",
  },
  {
    name: "YouTube Music",
    link: "https://music.youtube.com/search?q=hebert%20paes%20falcao",
  },
  {
    name: "Deezer",
    link: "https://www.deezer.com/search/hebert%20paes%20falcao",
  },
  {
    name: "Amazon Music",
    link: "https://music.amazon.com/search/hebert%20paes%20falcao",
  },
  {
    name: "TIDAL",
    link: "https://listen.tidal.com/search?q=hebert%20paes%20falcao",
  },
  {
    name: "SoundCloud",
    link: "https://soundcloud.com/search?q=hebert%20paes%20falcao",
  },
  {
    name: "Palco MP3",
    link: "https://www.palcomp3.com.br/busca/?q=hebert%20paes%20falcao",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white">
      <section className="px-4 pt-24 pb-16 text-center">
        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-blue-300 text-sm mb-4">Hebert Paes Falcao</p>
          <h1 className="text-5xl md:text-7xl font-black mb-6">Loja Virtual + Música em Todas as Plataformas</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Portfólio atualizado com uma experiência de e-commerce moderna para produtos oficiais e acesso rápido
            às músicas de Hebert Paes Falcao nos principais serviços de streaming.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#loja" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-all">
              Entrar na Loja
            </a>
            <a href="#musicas" className="border border-blue-400 hover:bg-blue-500/20 px-8 py-3 rounded-lg font-semibold transition-all">
              Ouvir Músicas
            </a>
            <a href="/openclaw" className="border border-cyan-300 text-cyan-200 hover:bg-cyan-500/20 px-8 py-3 rounded-lg font-semibold transition-all">
              OpenClaw
            </a>
          </div>
        </div>
      </section>

      <section id="loja" className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-bold">Loja Virtual</h2>
              <p className="text-gray-300 mt-2">Produtos oficiais com visual premium e foco em conversão.</p>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition-all">
              Finalizar compra
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <article key={product.name} className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/15 transition-all">
                <span className="inline-block mb-3 text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-300/40 px-2 py-1 rounded-full">
                  {product.tag}
                </span>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-300 text-sm mb-5 min-h-[3rem]">{product.description}</p>
                <div className="flex items-center justify-between">
                  <strong className="text-2xl text-emerald-300">{product.price}</strong>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    Adicionar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="musicas" className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Músicas de Hebert Paes Falcao</h2>
          <p className="text-gray-300 mb-8">
            Acesse as faixas nas plataformas abaixo. Os links abrem diretamente a busca do artista em cada serviço.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {streamingPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-5 py-4 font-semibold transition-all"
              >
                Ouvir no {platform.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center bg-white/10 border border-white/10 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-4">Contato & Parcerias</h2>
          <p className="text-gray-300 mb-6">Para shows, publis e projetos digitais, fale com a equipe.</p>
          <a href="mailto:contact@hebertpaes.com" className="text-blue-300 text-xl hover:text-blue-200">
            contact@hebertpaes.com
          </a>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-400 border-t border-white/10 mt-8">
        <p>© 2026 Hebert Paes Falcao. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
