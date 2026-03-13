type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = (await searchParams) || {};
  const checkoutRaw = params.checkoutId;
  const courseRaw = params.courseId;

  const checkoutId = Array.isArray(checkoutRaw) ? checkoutRaw[0] : checkoutRaw || "--";
  const courseId = Array.isArray(courseRaw) ? courseRaw[0] : courseRaw || "--";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-14 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Pagamento confirmado</p>
        <h1 className="mt-3 text-4xl font-black">Compra aprovada</h1>
        <p className="mt-3 text-slate-300">Matrícula ativada com sucesso.</p>

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
