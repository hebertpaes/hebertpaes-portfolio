"use client";

import { useEffect, useMemo, useState } from "react";
import { courses } from "@/lib/cursos-data";

type Enrollment = {
  checkoutId: string;
  courseId: string;
  studentName: string;
  studentEmail: string;
  status: string;
  createdAt: string;
};

export default function MinhaAreaPage() {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cursos/enrollments/me")
      .then((r) => r.json())
      .then((d) => setItems(d?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const enriched = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        course: courses.find((c) => c.id === item.courseId),
      })),
    [items]
  );

  return (
    <main className="min-h-screen bg-[#04060f] px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black">Minha Área</h1>
        <p className="mt-2 text-slate-300">Cursos com matrícula ativa para a sua conta.</p>

        {loading ? (
          <p className="mt-6 text-slate-300">Carregando matrículas...</p>
        ) : enriched.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            Nenhuma matrícula ativa encontrada.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {enriched.map((enrollment) => (
              <article key={enrollment.checkoutId} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{enrollment.courseId}</p>
                <h2 className="mt-2 text-xl font-bold">{enrollment.course?.title || "Curso"}</h2>
                <p className="mt-1 text-sm text-slate-300">Status: {enrollment.status}</p>
                <p className="text-sm text-slate-300">Ativado em: {new Date(enrollment.createdAt).toLocaleString("pt-BR")}</p>

                <a
                  href={`/cursos/${enrollment.courseId}`}
                  className="mt-4 inline-flex rounded-xl border border-white/20 bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  Continuar curso
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
