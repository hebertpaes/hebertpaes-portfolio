export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
      <div className="max-w-xl mx-auto bg-white/10 border border-white/15 rounded-2xl p-8">
        <h1 className="text-3xl font-black mb-3">Login do usuário</h1>
        <p className="text-slate-300 mb-6">Acesso da área OpenClaw em hebertpaes.com.</p>

        <div className="space-y-3 mb-6">
          <input className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3" placeholder="E-mail" type="email" />
          <input className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3" placeholder="Senha" type="password" />
          <button className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg px-4 py-3">Entrar</button>
        </div>

        <p className="text-xs text-slate-400">
          Próximo passo: conectar este formulário ao provedor de autenticação (Azure AD B2C/Entra) e banco SQL.
        </p>
      </div>
    </main>
  );
}
