import { courses } from "@/lib/cursos-data";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CursosCheckoutPage({ searchParams }: Props) {
  const params = (await searchParams) || {};
  const rawId = params.courseId;
  const courseId = Array.isArray(rawId) ? rawId[0] : rawId;
  const course = courses.find((c) => c.id === courseId) || courses[0];

  return (
    <main className="min-h-screen bg-[#050913] px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Checkout creator</p>
        <h1 className="mt-2 text-3xl font-black">Finalizar compra</h1>
        <p className="mt-2 text-slate-300">
          Curso: <span className="font-semibold text-cyan-200">{course.title}</span> • {course.price}
        </p>

        <div className="mt-6 space-y-3">
          <input disabled placeholder="Seu nome" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 opacity-80" />
          <input disabled placeholder="Seu e-mail" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 opacity-80" />
          <a
            href={`/cursos/checkout/sucesso?checkoutId=demo-${course.id}&courseId=${course.id}`}
            className="block w-full rounded-xl border border-white/20 bg-cyan-500 px-4 py-3 text-center font-bold text-slate-950 hover:bg-cyan-400"
          >
            Simular pagamento aprovado
          </a>
        </div>
      </div>
    </main>
  );
}
