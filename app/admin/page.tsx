export default function AdminEntryPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_90%_5%,rgba(168,85,247,0.16),transparent_33%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.14),transparent_28%)]" />

      <section className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-white/[0.06] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-cyan-200">Admin Control Center</p>
        <h1 className="text-4xl font-black leading-tight">Painel Administrativo</h1>
        <p className="mt-4 text-slate-300">
          Acesso seguro para monitorar infraestrutura, autenticação e conteúdo de podcast com interface moderna.
        </p>

        <div className="mt-8 grid gap-3 text-left text-sm text-slate-200 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">Visão de status</div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">Editor rápido</div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">Sessão protegida</div>
        </div>

        <a
          href="/admin/login"
          className="mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-white/20 bg-cyan-500 px-4 py-3.5 font-bold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-400"
        >
          Entrar no painel admin
        </a>
      </section>
    </main>
  );
}
