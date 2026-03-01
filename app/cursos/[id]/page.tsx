"use client";

import { useMemo, useState } from "react";
import { courseModulesById, courses } from "@/lib/cursos-data";

type Props = { params: { id: string } };

export default function CursoPlayerPage({ params }: Props) {
  const course = useMemo(() => courses.find((c) => c.id === params.id), [params.id]);
  const modules = courseModulesById[params.id] || [];
  const flatLessons = modules.flatMap((m) => m.lessons);
  const [activeLessonId, setActiveLessonId] = useState(flatLessons[0]?.id || "");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const activeLesson = flatLessons.find((l) => l.id === activeLessonId) || flatLessons[0];
  const progress = flatLessons.length ? Math.round((Object.keys(completed).length / flatLessons.length) * 100) : 0;

  if (!course) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">Curso não encontrado.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#04060f] px-4 py-10 text-white">
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

          <a
            href={`/cursos/checkout?courseId=${course.id}`}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-violet-600 px-4 py-2.5 font-semibold hover:bg-violet-500"
          >
            Comprar acesso / checkout
          </a>
        </aside>
      </div>
    </main>
  );
}
