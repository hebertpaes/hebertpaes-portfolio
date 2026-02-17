export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            Hebert Paes
          </h1>
          <p className="text-2xl md:text-3xl text-blue-300 mb-8">
            Desenvolvedor Full Stack & Arquiteto de Nuvem
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Construindo aplicações web modernas com Next.js, React e Serviços de Nuvem Azure
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#projects" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
              Ver Projetos
            </a>
            <a href="#contact" className="border-2 border-blue-600 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all">
              Entre em Contato
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-8 text-center">Sobre Mim</h2>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12">
            <p className="text-lg text-gray-200 mb-6">
              Sou um desenvolvedor apaixonado, especializado em construir aplicações web escaláveis
              usando tecnologias modernas. Com expertise em Next.js, React, TypeScript e
              serviços de nuvem Azure, crio soluções que são poderosas e elegantes.
            </p>
            <p className="text-lg text-gray-200 mb-6">
              Meu foco é entregar aplicações de alto desempenho com experiências de usuário
              excepcionais, aproveitando a infraestrutura de nuvem para escalabilidade e confiabilidade ideais.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/5 p-4 rounded-lg text-center">
                <p className="text-blue-400 font-semibold">Next.js</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg text-center">
                <p className="text-blue-400 font-semibold">React</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg text-center">
                <p className="text-blue-400 font-semibold">TypeScript</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg text-center">
                <p className="text-blue-400 font-semibold">Azure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-12 text-center">Projetos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">Plataforma E-Commerce</h3>
              <p className="text-gray-300 mb-4">
                Solução completa de e-commerce construída com Next.js e serviços Azure
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Next.js</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Azure</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">TypeScript</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">Painel de Nuvem</h3>
              <p className="text-gray-300 mb-4">
                Painel de análises em tempo real com integração Azure
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">React</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Azure CDN</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Node.js</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">Site Portfólio</h3>
              <p className="text-gray-300 mb-4">
                Site portfólio moderno implantado no Azure com CDN
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Next.js</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Tailwind</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Azure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-8">Entre em Contato</h2>
          <p className="text-xl text-gray-300 mb-12">
            Estou sempre aberto a discutir novos projetos e oportunidades.
          </p>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12">
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 mb-2">E-mail</p>
                <a href="mailto:contact@hebertpaes.com" className="text-2xl text-blue-400 hover:text-blue-300">
                  contact@hebertpaes.com
                </a>
              </div>
              <div>
                <p className="text-gray-400 mb-2">LinkedIn</p>
                <a href="https://linkedin.com/in/hebertpaes" target="_blank" rel="noopener noreferrer" className="text-2xl text-blue-400 hover:text-blue-300">
                  linkedin.com/in/hebertpaes
                </a>
              </div>
              <div>
                <p className="text-gray-400 mb-2">GitHub</p>
                <a href="https://github.com/hebertpaes" target="_blank" rel="noopener noreferrer" className="text-2xl text-blue-400 hover:text-blue-300">
                  github.com/hebertpaes
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400">
        <p>&copy; 2026 Hebert Paes. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
