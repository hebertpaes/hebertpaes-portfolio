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
    <main className="min-h-screen bg-slate-950 px-3 py-6 text-white sm:px-4 sm:py-10 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-cyan-300 sm:mb-3 sm:text-xs sm:tracking-[0.25em]">hebertpaes.com/openclaw/agents</p>
            <h1 className="mb-2 text-3xl font-black leading-tight sm:mb-3 sm:text-4xl md:text-5xl">Agents Hub</h1>
            <p className="max-w-3xl text-sm text-slate-300 sm:text-base">Olá, <strong>{session.login}</strong>. Painel autenticado com sessão segura.</p>
          </div>
          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
            <a href="/login" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 sm:px-5 sm:py-3 sm:text-base">
              Trocar usuário
            </a>
            <a href="/api/auth/logout" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-rose-300 sm:px-5 sm:py-3 sm:text-base">
              Sair
            </a>
          </div>
        </div>

        <section className="mb-8 grid gap-3 sm:gap-4 md:mb-10 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <article key={agent.name} className="rounded-2xl border border-white/15 bg-white/10 p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold leading-tight sm:text-xl">{agent.name}</h2>
                <span className="shrink-0 rounded-full border border-emerald-300/60 bg-emerald-500/15 px-2 py-1 text-[11px] text-emerald-200 sm:text-xs">{agent.status}</span>
              </div>
              <p className="mb-2 text-sm text-slate-300">{agent.role}</p>
              <p className="mb-4 text-sm text-cyan-200">Modelo: <span className="break-all">{agent.model}</span></p>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap) => (
                  <span key={cap} className="rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-200 sm:text-xs">
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
