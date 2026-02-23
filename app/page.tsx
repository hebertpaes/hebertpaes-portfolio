const products = [
  {
    name: "Camiseta Hebert Paes",
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

const floatingBtnClass =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-white/20 backdrop-blur-sm";

const streamingPlatforms = [
  {
    name: "Spotify",
    link: "https://open.spotify.com/search/hebert%20paes",
  },
  {
    name: "Apple Music",
    link: "https://music.apple.com/br/search?term=hebert%20paes",
  },
  {
    name: "YouTube Music",
    link: "https://music.youtube.com/playlist?list=OLAK5uy_mDljpGt6-_TCOS9EX1nG7RvQrDTsXJX0k&si=Ys2ZA9hDhSX45ukt",
  },
  {
    name: "Deezer",
    link: "https://www.deezer.com/search/hebert%20paes",
  },
  {
    name: "Amazon Music",
    link: "https://music.amazon.com/search/hebert%20paes",
  },
  {
    name: "TIDAL",
    link: "https://listen.tidal.com/search?q=hebert%20paes",
  },
  {
    name: "SoundCloud",
    link: "https://soundcloud.com/search?q=hebert%20paes",
  },
  {
    name: "Palco MP3",
    link: "https://www.palcomp3.com.br/busca/?q=hebert%20paes",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white">
      <section className="px-4 pt-24 pb-16 text-center">
        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-blue-300 text-sm mb-4">Hebert Paes</p>
          <h1 className="text-5xl md:text-7xl font-black mb-6">Loja Virtual + Música em Todas as Plataformas</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Portfólio atualizado com uma experiência de e-commerce moderna para produtos e acesso rápido
            às músicas de Hebert Paes nos principais serviços de streaming.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#loja" className={`${floatingBtnClass} bg-blue-600 hover:bg-blue-700 px-8 py-3`}>
              Entrar na Loja
            </a>
            <a href="#musicas" className={`${floatingBtnClass} bg-blue-500/15 text-blue-100 hover:bg-blue-500/25 px-8 py-3`}>
              Ouvir Músicas
            </a>
            <a href="/podcast" className={`${floatingBtnClass} bg-violet-500/15 text-violet-100 hover:bg-violet-500/25 px-8 py-3`}>
              Podcast
            </a>
            <a href="/openclaw" className={`${floatingBtnClass} bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/25 px-8 py-3`}>
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
            <button className={`${floatingBtnClass} bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold px-6 py-3`}>
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
                  <button className={`${floatingBtnClass} bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm`}>
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
          <h2 className="text-4xl font-bold mb-4">Músicas de Hebert Paes</h2>
          <p className="text-gray-300 mb-3">
            Acesse as faixas nas plataformas abaixo. Os links abrem diretamente a busca do artista em cada serviço.
          </p>
          <p className="text-blue-200/80 mb-2 text-sm md:text-base">
            Todas as músicas exibidas neste site são de <strong>Hebert Paes</strong>.
          </p>
          <p className="text-cyan-200/70 mb-8 text-xs md:text-sm">
            Playlist no YouTube Music vinculada na seção abaixo.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {streamingPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${floatingBtnClass} bg-white/10 hover:bg-white/20 px-5 py-4`}
              >
                Ouvir no {platform.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="chat" className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-4xl font-bold">Chat Jabes (Principal)</h2>
              <p className="text-gray-300 mt-2">Atendimento direto na página principal.</p>
            </div>
            <a href="/openclaw/chat" className={`${floatingBtnClass} bg-cyan-600 hover:bg-cyan-700 px-6 py-3`}>
              Abrir em tela cheia
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)] bg-black/20">
            <iframe
              src="/openclaw/chat"
              title="Chat Jabes"
              className="w-full h-[760px] bg-slate-950"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center bg-white/10 border border-white/10 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-4">Contato & Parcerias</h2>
          <p className="text-gray-300 mb-6">Para shows, publis e projetos digitais, fale com a equipe.</p>
          <a href="mailto:contato@hebertpaes.com" className="text-blue-300 text-xl hover:text-blue-200">
            contato@hebertpaes.com
          </a>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-400 border-t border-white/10 mt-8">
        <p>© 2026 Hebert Paes. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
