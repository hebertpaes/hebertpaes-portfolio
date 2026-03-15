import type { Metadata } from "next";
import Instituto3D from "./Instituto3D";
import MapaInstituto from "./MapaInstituto";

export const metadata: Metadata = {
  title: "Instituto Hélio Marinho | Projeto Arquitetônico",
  description: "Projeto conceitual arquitetônico com visualização 3D interativa para Várzea Grande, MT.",
};

const floors = [
  "Subsolo ao 4º: Estacionamento (5 níveis, ~200 vagas)",
  "5º: Recepção, auditório (200 lugares), café e banheiros",
  "6º ao 12º: Educação (salas, laboratórios, biblioteca)",
  "13º ao 20º: Saúde (consultórios, exames, laboratório, fisioterapia)",
  "21º: Administração",
  "22º: Cobertura de convivência, terraço e jardim suspenso",
];

export default function InstitutoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300">hebertpaes.com/instituto</p>
        <h1 className="text-3xl font-semibold sm:text-5xl">Instituto Hélio Marinho — Várzea Grande, MT</h1>
        <p className="mt-4 max-w-4xl text-sm text-slate-300 sm:text-base">
          Estudo arquitetônico conceitual com foco em educação e saúde pública. Coordenadas: -15.66648775, -56.13251649.
          Terreno de 1.325,63 m², elevação média 188,27 m.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Instituto3D />
            <p className="mt-3 text-xs text-slate-400">Modelo 3D interativo conceitual (orbitar/zoom) com elevador panorâmico externo.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <h2 className="text-xl font-semibold">Programa de necessidades</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {floors.map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-900/20 p-4 text-sm">
              <p className="font-medium text-emerald-200">Sustentabilidade e acessibilidade</p>
              <p className="mt-2 text-emerald-100/90">Painéis solares, captação de chuva, elevadores adaptados, rotas acessíveis, fachada com brises.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold">Memorial descritivo (resumo)</h3>
            <p className="mt-3 text-sm text-slate-300">
              Implantação vertical de uso misto (educação + saúde), circulação principal por núcleos de elevadores e escadas pressurizadas,
              torre externa de elevador panorâmico em vidro laminado estrutural, e cobertura de convivência com jardim suspenso.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold">Orçamento estimado (ordem de grandeza)</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>Área construída estimada: 18.500 a 22.000 m²</li>
              <li>Custo médio vertical alto padrão técnico: R$ 6.500 a R$ 8.800 / m²</li>
              <li>Total estimado: R$ 120 mi a R$ 185 mi</li>
              <li>Prazo estimado: 30 a 42 meses (projeto + obra)</li>
            </ul>
          </article>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h3 className="text-lg font-semibold">Implantação no mapa (Google API)</h3>
          <p className="mt-2 text-sm text-slate-300">A área branca do mapa pode ser usada como referência de implantação preliminar do volume do instituto.</p>
          <div className="mt-4">
            <MapaInstituto />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-900/20 p-5 text-sm text-cyan-100">
          <p className="font-semibold">Comandos para a Vy/OpenClaw executar deploy</p>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-cyan-300/30 bg-slate-950/80 p-3 text-xs text-cyan-100">{`cd ~/workspace/hebertpaes-portfolio
npm install
npm run build
# publicar no provider (Vercel/Cloudflare Pages) com branch main
# validar rota:
# https://hebertpaes.com/instituto`}</pre>
        </div>
      </section>
    </main>
  );
}
