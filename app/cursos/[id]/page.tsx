"use client";

import { useEffect, useMemo, useState } from "react";
import { courseModulesById, courses } from "@/lib/cursos-data";

type Props = { params: { id: string } };

export default function CursoPlayerPage({ params }: Props) {
  const course = useMemo(() => courses.find((c) => c.id === params.id), [params.id]);
  const modules = courseModulesById[params.id] || [];
  const flatLessons = modules.flatMap((m) => m.lessons);
  const [activeLessonId, setActiveLessonId] = useState(flatLessons[0]?.id || "");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [enrollmentChecked, setEnrollmentChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    fetch(`/api/cursos/enrollments/me?courseId=${params.id}`)
      .then((r) => r.json())
      .then((d) => setHasAccess(Boolean(d?.enrolled)))
      .catch(() => setHasAccess(false))
      .finally(() => setEnrollmentChecked(true));
  }, [params.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = JSON.parse(localStorage.getItem("course_view_history") || "[]") as string[];
    const next = [params.id, ...prev.filter((id) => id !== params.id)].slice(0, 20);
    localStorage.setItem("course_view_history", JSON.stringify(next));
  }, [params.id]);

  const activeLesson = flatLessons.find((l) => l.id === activeLessonId) || flatLessons[0];
  const progress = flatLessons.length ? Math.round((Object.keys(completed).length / flatLessons.length) * 100) : 0;
  const alsoLike = course
    ? courses.filter((c) => c.id !== course.id && (c.category === course.category || c.level === course.level)).slice(0, 3)
    : [];

  if (!course) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">Curso não encontrado.</div>
      </main>
    );
  }

  if (!enrollmentChecked) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">Validando acesso...</div>
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-slate-300">Você precisa de matrícula ativa para assistir este curso.</p>
          <div className="mt-4 flex gap-2">
            <a href={`/cursos/checkout?courseId=${course.id}`} className="rounded-xl border border-white/20 bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400">Comprar agora</a>
            <a href="/cursos/minha-area" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-semibold hover:bg-white/15">Minha área</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#04060f] px-4 py-10 text-white">
      <div className="mx-auto mb-4 max-w-7xl">
        <a href="/cursos/minha-area" className="text-sm text-cyan-200 hover:text-cyan-100">← Minha área</a>
      </div>
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
          <h1 className="mb-3 text-3xl font-black">{course.title}</h1>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <iframe
              src={activeLesson?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
              title={activeLesson?.title || "Aula"}
              className="h-[420px] w-full"
              allowFullScreen
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Aula atual</p>
              <p className="font-semibold">{activeLesson?.title || "Selecione uma aula"}</p>
            </div>
            {activeLesson && (
              <button
                onClick={() => setCompleted((prev) => ({ ...prev, [activeLesson.id]: true }))}
                className="rounded-xl border border-white/20 bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400"
              >
                Marcar concluída
              </button>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="mb-1 flex justify-between text-sm text-slate-300">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-300">Módulos</p>
          <div className="space-y-3">
            {modules.map((module) => (
              <div key={module.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <h2 className="mb-2 font-semibold">{module.title}</h2>
                <div className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`flex w-full items-center justify-between rounded-lg border px-2 py-2 text-left text-sm ${
                        activeLessonId === lesson.id
                          ? "border-cyan-300/70 bg-cyan-300/15"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span>{lesson.title}</span>
                      <span className="text-xs text-slate-300">{lesson.minutes}m {completed[lesson.id] ? "✓" : ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="mx-auto mt-6 max-w-7xl rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
        <p className="mb-2 text-sm font-semibold">Você também pode gostar</p>
        <div className="grid gap-3 md:grid-cols-3">
          {alsoLike.map((c) => (
            <a key={c.id} href={`/cursos/${c.id}`} className="rounded-2xl border border-white/10 bg-black/20 p-3 hover:bg-black/30">
              <p className="text-xs text-slate-300">{c.category}</p>
              <p className="font-semibold">{c.title}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
