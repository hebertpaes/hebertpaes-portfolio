"use client";

export default function CheckoutSuccessPage() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const checkoutId = params.get("checkoutId") || "--";
  const courseId = params.get("courseId") || "--";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-14 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Pagamento confirmado</p>
        <h1 className="mt-3 text-4xl font-black">Compra aprovada</h1>
        <p className="mt-3 text-slate-300">Seu acesso foi liberado. Você já pode consumir as aulas no player.</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-left text-sm">
          <p><strong>Checkout:</strong> {checkoutId}</p>
          <p><strong>Curso:</strong> {courseId}</p>
        </div>

        <a href={`/cursos/${courseId}`} className="mt-6 inline-flex rounded-xl border border-white/20 bg-cyan-500 px-5 py-2.5 font-bold text-slate-950 hover:bg-cyan-400">
          Ir para o curso
        </a>
      </div>
    </main>
  );
}
