import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard IA",
  description: "Painel de usuário com visão de uso, assinaturas, histórico e performance de modelos.",
  alternates: { canonical: "/dashboard" },
};

const stats = [
  { label: "Tokens processados", value: "8.4M", trend: "+18%" },
  { label: "Sessões ativas", value: "124", trend: "+9%" },
  { label: "Receita da Loja IA", value: "R$ 42.900", trend: "+27%" },
  { label: "Alunos em cursos", value: "1.382", trend: "+14%" },
];

const models = [
  { name: "OpenAI GPT-4.1", latency: "820ms", quality: "98/100", cost: "R$ 0,029" },
  { name: "Claude 3.7 Sonnet", latency: "910ms", quality: "97/100", cost: "R$ 0,031" },
  { name: "Gemini 2.5 Pro", latency: "780ms", quality: "96/100", cost: "R$ 0,024" },
  { name: "Llama 3.3 70B", latency: "650ms", quality: "93/100", cost: "R$ 0,017" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-black">Dashboard do Usuário IA</h1>
        <p className="mt-2 text-sm text-slate-300">Controle completo da operação, aprendizado e monetização da plataforma.</p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-black">{stat.value}</p>
              <p className="mt-1 text-xs font-bold text-emerald-300">{stat.trend}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-extrabold">Performance por Modelo</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-300">
                <tr>
                  <th className="px-3 py-2">Modelo</th>
                  <th className="px-3 py-2">Latência</th>
                  <th className="px-3 py-2">Qualidade</th>
                  <th className="px-3 py-2">Custo / 1k tokens</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.name} className="border-t border-white/10">
                    <td className="px-3 py-2 font-semibold">{model.name}</td>
                    <td className="px-3 py-2">{model.latency}</td>
                    <td className="px-3 py-2">{model.quality}</td>
                    <td className="px-3 py-2">{model.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
