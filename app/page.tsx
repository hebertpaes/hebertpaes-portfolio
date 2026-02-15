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
            Full Stack Developer & Cloud Architect
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Building modern web applications with Next.js, React, and Azure Cloud Services
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#projects" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
              View Projects
            </a>
            <a href="#contact" className="border-2 border-blue-600 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-8 text-center">About Me</h2>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12">
            <p className="text-lg text-gray-200 mb-6">
              I'm a passionate developer specializing in building scalable web applications 
              using modern technologies. With expertise in Next.js, React, TypeScript, and 
              Azure cloud services, I create solutions that are both powerful and elegant.
            </p>
            <p className="text-lg text-gray-200 mb-6">
              My focus is on delivering high-performance applications with exceptional user 
              experiences, leveraging cloud infrastructure for optimal scalability and reliability.
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
          <h2 className="text-5xl font-bold text-white mb-12 text-center">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">E-Commerce Platform</h3>
              <p className="text-gray-300 mb-4">
                Full-stack e-commerce solution built with Next.js and Azure services
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Next.js</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Azure</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">TypeScript</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">Cloud Dashboard</h3>
              <p className="text-gray-300 mb-4">
                Real-time analytics dashboard with Azure integration
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">React</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Azure CDN</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Node.js</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">Portfolio Website</h3>
              <p className="text-gray-300 mb-4">
                Modern portfolio site deployed on Azure with CDN
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
          <h2 className="text-5xl font-bold text-white mb-8">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-12">
            I'm always open to discussing new projects and opportunities.
          </p>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12">
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 mb-2">Email</p>
                <a href="mailto:contact@hebertpaes.com" className="text-2xl text-blue-400 hover:text-blue-300">
                  contact@hebertpaes.com
                </a>
              </div>
              <div>
                <p className="text-gray-400 mb-2">LinkedIn</p>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-2xl text-blue-400 hover:text-blue-300">
                  linkedin.com/in/hebertpaes
                </a>
              </div>
              <div>
                <p className="text-gray-400 mb-2">GitHub</p>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-2xl text-blue-400 hover:text-blue-300">
                  github.com/hebertpaes
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400">
        <p>&copy; 2026 Hebert Paes. All rights reserved.</p>
      </footer>
    </main>
  );
}
