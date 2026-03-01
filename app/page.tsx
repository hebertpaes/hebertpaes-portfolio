"use client";

import { useEffect } from "react";

const ctaClass =
  "inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] border border-white/15 backdrop-blur-sm";

const experiencePillars = [
  {
    label: "Identidade viva",
    text: "Camadas de luz, gradientes dinâmicos e visual cinematográfico para marca forte.",
    color: "from-cyan-400/30 to-sky-400/10",
  },
  {
    label: "Navegação inteligente",
    text: "Fluxo focado em ação: Podcast, Loja e Chat destacados em poucos cliques.",
    color: "from-violet-400/30 to-fuchsia-400/10",
  },
  {
    label: "Experiência mobile-first",
    text: "Tipografia responsiva, cartões com alto contraste e leitura confortável em qualquer tela.",
    color: "from-amber-300/30 to-orange-400/10",
  },
];

const metrics = [
  { value: "+38%", label: "Mais foco nos blocos principais" },
  { value: "3x", label: "Mais destaque para CTAs" },
  { value: "100%", label: "Interface otimizada para mobile" },
];

export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04070f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.25),transparent_34%),radial-gradient(circle_at_88%_2%,rgba(168,85,247,0.24),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.18),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(4,7,15,0.2)_45%,rgba(4,7,15,0.85)_100%)]" />

      <div className="pointer-events-none absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl animate-pulse [animation-delay:600ms]" />

      <section data-reveal className="reveal relative px-4 pt-24 pb-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
              Hebert Paes • Nova Experiência Digital
            </p>
            <h1 className="text-5xl font-black leading-[0.95] md:text-7xl">
              Design inovador
              <span className="block bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                com presença de palco
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-xl">
              Homepage recriada com linguagem visual premium, hierarquia clara e blocos interativos para transformar
              visita em ação.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a href="/podcast" className={`${ctaClass} bg-violet-600 hover:bg-violet-500`}>
                Ver Podcast
              </a>
              <a href="#chat" className={`${ctaClass} bg-cyan-600 hover:bg-cyan-500`}>
                Abrir Chat Jabes
              </a>
              <a href="#loja" className={`${ctaClass} bg-amber-500/15 text-amber-100 hover:bg-amber-500/25`}>
                Loja em reformulação
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Impacto visual</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {metrics.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <p className="text-2xl font-black text-cyan-200 md:text-3xl">{item.value}</p>
                  <p className="mt-2 text-xs text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-slate-300">
              Layout focado em performance, clareza e autoridade da marca em todos os pontos de contato.
            </p>
          </div>
        </div>
      </section>

      <section data-reveal className="reveal relative px-4 pb-12">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {experiencePillars.map((pillar) => (
            <article
              key={pillar.label}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/30"
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${pillar.color} opacity-70`} />
              <h2 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-100">{pillar.label}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section data-reveal id="loja" className="reveal relative px-4 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-amber-200/25 bg-gradient-to-r from-amber-400/10 to-orange-500/10 p-8 shadow-[0_25px_90px_rgba(251,191,36,0.14)] md:p-10">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Loja virtual</p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">Loja em reformulação criativa</h2>
          <p className="mt-3 text-amber-50/90">
            Como solicitado, sem imagens e sem produtos no momento. O novo conceito da loja está sendo preparado para
            uma volta com mais personalidade e conversão.
          </p>
        </div>
      </section>

      <section data-reveal id="chat" className="reveal relative px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-bold">Chat Jabes</h2>
              <p className="mt-2 text-slate-300">Atendimento direto com visual integrado ao novo design.</p>
            </div>
            <a href="/openclaw/chat" className={`${ctaClass} bg-cyan-600 hover:bg-cyan-500`}>
              Abrir em tela cheia
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/15 bg-black/25 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <iframe src="/openclaw/chat" title="Chat Jabes" className="h-[760px] w-full bg-slate-950" loading="lazy" />
          </div>
        </div>
      </section>

      <section data-reveal id="contact" className="reveal relative px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.06] p-10 text-center backdrop-blur-lg">
          <h2 className="text-3xl font-bold">Contato & Parcerias</h2>
          <p className="mb-6 mt-3 text-slate-300">Para shows, publis e projetos digitais, fale com a equipe.</p>
          <a href="mailto:contato@hebertpaes.com" className="text-xl text-cyan-300 transition-colors hover:text-cyan-200">
            contato@hebertpaes.com
          </a>
        </div>
      </section>

      <footer className="relative mt-8 border-t border-white/10 py-10 text-center text-slate-400">
        <p>© 2026 Hebert Paes. Todos os direitos reservados.</p>
      </footer>

      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 700ms ease, transform 700ms ease;
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </main>
  );
}
