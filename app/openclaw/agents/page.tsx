import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookieName, verifySessionToken } from "@/lib/session";

const agents = [
  {
    name: "Codex Agent",
    role: "Desenvolvimento e execução técnica",
    status: "Ativo",
    model: "gpt-5.3-codex",
    capabilities: ["Code", "Build", "Deploy", "Diagnóstico"],
  },
  {
    name: "Main Agent",
    role: "Coordenação geral e respostas",
    status: "Ativo",
    model: "claude-opus-4-6",
    capabilities: ["Planejamento", "Atendimento", "Memória"],
  },
  {
    name: "Gemini Agent",
    role: "Pesquisa e análise ampliada",
    status: "Ativo",
    model: "gemini-3-pro-preview",
    capabilities: ["Pesquisa", "Síntese", "Comparações"],
  },
];

export default async function OpenClawAgentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect("/login?error=auth_required");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start gap-4 flex-wrap mb-8">
          <div>
            <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs mb-3">hebertpaes.com/openclaw/agents</p>
            <h1 className="text-4xl md:text-5xl font-black mb-3">Agents Hub</h1>
            <p className="text-slate-300 max-w-3xl">Olá, <strong>{session.login}</strong>. Painel autenticado com sessão segura.</p>
          </div>
          <a href="/login" className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-5 py-3 rounded-xl">
            Trocar usuário
          </a>
        </div>

        <section className="grid md:grid-cols-3 gap-4 mb-10">
          {agents.map((agent) => (
            <article key={agent.name} className="bg-white/10 border border-white/15 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold">{agent.name}</h2>
                <span className="text-xs px-2 py-1 rounded-full border border-emerald-300/60 text-emerald-200 bg-emerald-500/15">{agent.status}</span>
              </div>
              <p className="text-slate-300 text-sm mb-2">{agent.role}</p>
              <p className="text-cyan-200 text-sm mb-4">Modelo: {agent.model}</p>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap) => (
                  <span key={cap} className="text-xs bg-slate-900/80 border border-slate-700 rounded-full px-2 py-1 text-slate-200">
                    {cap}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
