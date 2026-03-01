"use client";

import { FormEvent, useMemo, useState } from "react";
import { courses } from "@/lib/cursos-data";

export default function CursosCheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const course = useMemo(() => {
    if (typeof window === "undefined") return courses[0];
    const params = new URLSearchParams(window.location.search);
    const id = params.get("courseId") || courses[0].id;
    return courses.find((c) => c.id === id) || courses[0];
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/cursos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, name, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage("Falha ao iniciar checkout.");
        return;
      }

      setMessage(`Checkout criado: ${data.checkoutId}. Link de pagamento: ${data.paymentUrl}`);
    } catch {
      setMessage("Erro de conexão no checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050913] px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Checkout creator</p>
        <h1 className="mt-2 text-3xl font-black">Finalizar compra</h1>
        <p className="mt-2 text-slate-300">Curso: <span className="font-semibold text-cyan-200">{course.title}</span> • {course.price}</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-white/20 bg-cyan-500 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? "Processando..." : "Pagar agora"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-emerald-200">{message}</p>}
      </div>
    </main>
  );
}
