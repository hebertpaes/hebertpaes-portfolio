'use client';

import { useEffect, useState } from 'react';

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

export default function AdminDashboard() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/prototype/podcast')
      .then((r) => r.json())
      .then((d) => setEpisodes(d.episodes || []))
      .catch(() => setEpisodes([]));

    fetch('/api/admin/overview')
      .then((r) => r.json())
      .then((d) => setOverview(d))
      .catch(() => setOverview(null));
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
      if (data.ok) {
        setNotice('Podcast atualizado com sucesso.');
      } else {
        setNotice('Falha ao salvar podcast.');
      }
    } catch {
      setNotice('Erro ao salvar podcast.');
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <a href="/podcast" className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors">Ver Podcast</a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">OAuth</p>
              <p className="text-white font-semibold">Google: {overview?.auth?.google ? 'ativo' : 'pendente'}</p>
              <p className="text-white font-semibold">GitHub: {overview?.auth?.github ? 'ativo' : 'pendente'}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">Infra</p>
              <p className="text-white font-semibold">SQL: {overview?.infra?.sql ? 'conectado' : 'pendente'}</p>
              <p className="text-white font-semibold">OpenClaw Proxy: {overview?.infra?.openclawProxy ? 'ativo' : 'pendente'}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">Atualização</p>
              <p className="text-white font-semibold">{overview?.updatedAt ? new Date(overview.updatedAt).toLocaleString('pt-BR') : '—'}</p>
              <a href="/openclaw/status" className="text-cyan-300 text-sm underline">Ver status completo</a>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Editor de Podcast</h3>
            <p className="text-gray-400 mb-4">Edite títulos, descrições e links diretamente daqui.</p>

            <div className="space-y-4">
              {episodes.map((ep) => (
                <div key={ep.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
                  <input value={ep.title} onChange={(e) => updateEpisode(ep.id, 'title', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Título" />
                  <input value={ep.summary} onChange={(e) => updateEpisode(ep.id, 'summary', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Resumo" />
                  <div className="grid md:grid-cols-2 gap-2">
                    <input value={ep.duration} onChange={(e) => updateEpisode(ep.id, 'duration', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Duração" />
                    <input value={ep.link} onChange={(e) => updateEpisode(ep.id, 'link', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Link" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={saveEpisodes} disabled={saving} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold rounded-lg">
                {saving ? 'Salvando...' : 'Salvar podcast'}
              </button>
              {notice && <span className="text-sm text-cyan-200">{notice}</span>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
