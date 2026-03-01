"use client";

import { useEffect, useState } from "react";

const ctaClass =
  "inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-[0_12px_30px_rgba(0,0,0,0.25)] border backdrop-blur-sm";

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

const animatedWords = ["Design", "inovador"];

export default function Home() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const applyTheme = () => setIsLight(media.matches);

    applyTheme();
    media.addEventListener("change", applyTheme);

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

    let rafId = 0;
    const handleMouseMove = (event: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);

        const x = (event.clientX / window.innerWidth - 0.5) * 18;
        const y = (event.clientY / window.innerHeight - 0.5) * 18;
        document.documentElement.style.setProperty("--hero-x", `${x}px`);
        document.documentElement.style.setProperty("--hero-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      media.removeEventListener("change", applyTheme);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const themeClasses = isLight
    ? {
        main: "bg-slate-100 text-slate-900",
        card: "border-slate-800/10 bg-white/70 text-slate-800",
        softText: "text-slate-600",
        email: "text-cyan-700 hover:text-cyan-600",
        ctaPrimary: "bg-violet-600 hover:bg-violet-500 text-white border-white/20",
        ctaChat: "bg-cyan-600 hover:bg-cyan-500 text-white border-white/20",
        ctaShop: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 border-amber-600/20",
      }
    : {
        main: "bg-[#04070f] text-white",
        card: "border-white/10 bg-white/[0.05] text-white",
        softText: "text-slate-300",
        email: "text-cyan-300 hover:text-cyan-200",
        ctaPrimary: "bg-violet-600 hover:bg-violet-500 text-white border-white/15",
        ctaChat: "bg-cyan-600 hover:bg-cyan-500 text-white border-white/15",
        ctaShop: "bg-amber-500/15 hover:bg-amber-500/25 text-amber-100 border-amber-300/20",
      };

  return (
    <main className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${themeClasses.main}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.25),transparent_34%),radial-gradient(circle_at_88%_2%,rgba(168,85,247,0.24),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.18),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(4,7,15,0.2)_45%,rgba(4,7,15,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-0 cursor-glow" />

      <div className="pointer-events-none absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl animate-pulse [animation-delay:600ms]" />

      <section data-reveal className="reveal relative px-4 pt-24 pb-20">
        <div
          className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end"
          style={{ transform: "translate3d(var(--hero-x), var(--hero-y), 0)" }}
        >
          <div>
            <p className="mb-4 inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
              Hebert Paes • Nova Experiência Digital
            </p>
            <h1 className="text-5xl font-black leading-[0.95] md:text-7xl">
              <span className="block" aria-label="Design inovador">
                {animatedWords.map((word, index) => (
                  <span
                    key={word}
                    className="hero-word inline-block"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
              </span>
              <span className="block bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                com presença de palco
              </span>
            </h1>
            <p className={`mt-6 max-w-2xl text-base md:text-xl ${themeClasses.softText}`}>
              Homepage recriada com linguagem visual premium, hierarquia clara e blocos interativos para transformar
              visita em ação.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a href="/podcast" className={`${ctaClass} ${themeClasses.ctaPrimary}`}>
                Ver Podcast
              </a>
              <a href="#chat" className={`${ctaClass} ${themeClasses.ctaChat}`}>
                Abrir Chat Jabes
              </a>
              <a href="#loja" className={`${ctaClass} ${themeClasses.ctaShop}`}>
                Loja em reformulação
              </a>
            </div>
          </div>

          <div className={`rounded-3xl border p-6 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.35)] ${themeClasses.card}`}>
            <p className={`text-sm uppercase tracking-[0.2em] ${themeClasses.softText}`}>Impacto visual</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {metrics.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/15 p-4 text-center dark:bg-black/20">
                  <p className="text-2xl font-black text-cyan-200 md:text-3xl">{item.value}</p>
                  <p className={`mt-2 text-xs ${themeClasses.softText}`}>{item.label}</p>
                </div>
              ))}
            </div>
            <p className={`mt-5 text-sm ${themeClasses.softText}`}>
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
              className={`group relative overflow-hidden rounded-3xl border p-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/30 ${themeClasses.card}`}
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${pillar.color} opacity-70`} />
              <h2 className="text-xl font-bold transition-colors group-hover:text-cyan-100">{pillar.label}</h2>
              <p className={`mt-3 text-sm leading-relaxed ${themeClasses.softText}`}>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section data-reveal id="loja" className="reveal relative px-4 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-amber-200/25 bg-gradient-to-r from-amber-400/10 to-orange-500/10 p-8 shadow-[0_25px_90px_rgba(251,191,36,0.14)] backdrop-blur-xl md:p-10">
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
              <p className={`mt-2 ${themeClasses.softText}`}>Atendimento direto com visual integrado ao novo design.</p>
            </div>
            <a href="/openclaw/chat" className={`${ctaClass} ${themeClasses.ctaChat}`}>
              Abrir em tela cheia
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/15 bg-black/25 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <iframe src="/openclaw/chat" title="Chat Jabes" className="h-[760px] w-full bg-slate-950" loading="lazy" />
          </div>
        </div>
      </section>

      <section data-reveal id="contact" className="reveal relative px-4 py-16">
        <div className={`mx-auto max-w-4xl rounded-3xl border p-10 text-center backdrop-blur-lg ${themeClasses.card}`}>
          <h2 className="text-3xl font-bold">Contato & Parcerias</h2>
          <p className={`mb-6 mt-3 ${themeClasses.softText}`}>Para shows, publis e projetos digitais, fale com a equipe.</p>
          <a href="mailto:contato@hebertpaes.com" className={`text-xl transition-colors ${themeClasses.email}`}>
            contato@hebertpaes.com
          </a>
        </div>
      </section>

      <footer className="relative mt-8 border-t border-white/10 py-10 text-center text-slate-400">
        <p>© 2026 Hebert Paes. Todos os direitos reservados.</p>
      </footer>

      <style jsx global>{`
        :root {
          --cursor-x: 50vw;
          --cursor-y: 50vh;
          --hero-x: 0px;
          --hero-y: 0px;
        }

        .cursor-glow {
          background: radial-gradient(
            360px circle at var(--cursor-x) var(--cursor-y),
            rgba(56, 189, 248, 0.18),
            rgba(168, 85, 247, 0.08) 28%,
            transparent 60%
          );
          transition: background 120ms linear;
        }

        .hero-word {
          opacity: 0;
          transform: translateY(14px) scale(0.98);
          animation: riseWords 700ms ease forwards;
        }

        @keyframes riseWords {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 700ms ease, transform 700ms ease;
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .cursor-glow {
            background: none;
          }

          .hero-word,
          .reveal {
            animation: none !important;
            transition: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}
