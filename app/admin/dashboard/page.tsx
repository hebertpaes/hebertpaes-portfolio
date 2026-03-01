'use client';

import { useEffect, useMemo, useState } from 'react';

type Episode = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  link: string;
};

type Overview = {
  auth: { google: boolean; github: boolean };
  infra: { sql: boolean; openclawProxy: boolean; upstreamWs: string | null };
  updatedAt: string;
};

const shellCard = 'rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl';

export default function AdminDashboard() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const loadData = async () => {
    setLoadingOverview(true);
    try {
      const [podcastRes, overviewRes] = await Promise.all([fetch('/api/prototype/podcast'), fetch('/api/admin/overview')]);
      const podcastData = await podcastRes.json();
      const overviewData = await overviewRes.json();

      setEpisodes(podcastData?.episodes || []);
      setOverview(overviewData?.ok ? overviewData : null);
    } catch {
      setEpisodes([]);
      setOverview(null);
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  const updateEpisode = (id: string, field: keyof Episode, value: string) => {
    setEpisodes((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const saveEpisodes = async () => {
    setSaving(true);
    setNotice('');
    try {
      const res = await fetch('/api/prototype/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodes }),
      });
      const data = await res.json();
      setNotice(data?.ok ? 'Podcast atualizado com sucesso.' : 'Falha ao salvar podcast.');
    } catch {
      setNotice('Erro ao salvar podcast.');
    } finally {
      setSaving(false);
    }
  };

  const statusCards = useMemo(
    () => [
      {
        title: 'OAuth',
        lines: [
          `Google: ${overview?.auth?.google ? 'ativo' : 'pendente'}`,
          `GitHub: ${overview?.auth?.github ? 'ativo' : 'pendente'}`,
        ],
      },
      {
        title: 'Infraestrutura',
        lines: [
          `SQL: ${overview?.infra?.sql ? 'conectado' : 'pendente'}`,
          `OpenClaw Proxy: ${overview?.infra?.openclawProxy ? 'ativo' : 'pendente'}`,
        ],
      },
      {
        title: 'Atualização',
        lines: [overview?.updatedAt ? new Date(overview.updatedAt).toLocaleString('pt-BR') : '—', overview?.infra?.upstreamWs || 'WS não definido'],
      },
    ],
    [overview]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_88%_6%,rgba(168,85,247,0.14),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.12),transparent_30%)]" />

      <nav className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-200">Admin Console</p>
            <h1 className="text-lg font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/podcast" className="rounded-xl border border-white/20 bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500">
              Ver Podcast
            </a>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/20 bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">Controle operacional</h2>
            <p className="text-slate-300">Visão de autenticação, infraestrutura e edição de conteúdo em tempo real.</p>
          </div>
          <button
            onClick={loadData}
            disabled={loadingOverview}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-white/10 disabled:opacity-60"
          >
            {loadingOverview ? 'Atualizando...' : 'Atualizar status'}
          </button>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {statusCards.map((card) => (
            <article key={card.title} className={`${shellCard} p-4`}>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-300">{card.title}</p>
              {card.lines.map((line) => (
                <p key={line} className="font-semibold text-white">
                  {line}
                </p>
              ))}
              {card.title === 'Atualização' && (
                <a href="/openclaw/status" className="mt-2 inline-block text-sm text-cyan-200 underline">
                  Ver status completo
                </a>
              )}
            </article>
          ))}
        </section>

        <section className={`${shellCard} mt-6 p-6`}>
          <h3 className="text-xl font-bold">Editor de Podcast</h3>
          <p className="mb-4 mt-1 text-slate-300">Edite títulos, descrições e links com preview rápido para publicação.</p>

          <div className="space-y-4">
            {episodes.map((ep) => (
              <div key={ep.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <input
                  value={ep.title}
                  onChange={(e) => updateEpisode(ep.id, 'title', e.target.value)}
                  className="mb-2 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-cyan-300/60"
                  placeholder="Título"
                />
                <textarea
                  value={ep.summary}
                  onChange={(e) => updateEpisode(ep.id, 'summary', e.target.value)}
                  className="mb-2 min-h-[84px] w-full resize-y rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-cyan-300/60"
                  placeholder="Resumo"
                />
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={ep.duration}
                    onChange={(e) => updateEpisode(ep.id, 'duration', e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-cyan-300/60"
                    placeholder="Duração"
                  />
                  <input
                    value={ep.link}
                    onChange={(e) => updateEpisode(ep.id, 'link', e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-cyan-300/60"
                    placeholder="Link"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={saveEpisodes}
              disabled={saving}
              className="rounded-xl border border-white/20 bg-emerald-500 px-4 py-2 font-bold text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar podcast'}
            </button>
            {notice && <span className="text-sm text-cyan-200">{notice}</span>}
          </div>
        </section>
      </main>
    </div>
  );
}
