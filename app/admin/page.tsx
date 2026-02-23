export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-center text-3xl font-extrabold text-white">Admin</h2>
        <p className="text-center text-sm text-gray-300">Acesso administrativo validado no banco de dados.</p>
        <a
          href="/admin/login"
          className="w-full inline-flex items-center justify-center bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl px-4 py-3.5 transition-all"
        >
          Entrar no painel admin
        </a>
      </div>
    </div>
  );
}
