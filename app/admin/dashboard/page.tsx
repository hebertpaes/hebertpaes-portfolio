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

type AuditItem = {
  id: string;
  adminLogin?: string;
  action: string;
  status: 'ok' | 'warn';
  context?: string | null;
  createdAt: string;
};

const shellCard = 'rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl';

export default function AdminDashboard() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [auditLog, setAuditLog] = useState<AuditItem[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'withLink' | 'withoutLink'>('all');
  const [auditAdminFilter, setAuditAdminFilter] = useState('all');
  const [auditStatusFilter, setAuditStatusFilter] = useState<'all' | 'ok' | 'warn'>('all');
  const [auditFrom, setAuditFrom] = useState('');
  const [auditTo, setAuditTo] = useState('');

  const recordAudit = async (action: string, status: 'ok' | 'warn' = 'ok', context = '') => {
    try {
      await fetch('/api/admin/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, status, context }),
      });
    } catch {
      // non-blocking
    }
  };

  const loadAudit = async () => {
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (auditAdminFilter !== 'all') params.set('admin', auditAdminFilter);
      if (auditStatusFilter !== 'all') params.set('status', auditStatusFilter);
      if (auditFrom) params.set('from', new Date(`${auditFrom}T00:00:00`).toISOString());
      if (auditTo) params.set('to', new Date(`${auditTo}T23:59:59`).toISOString());

      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      const data = await res.json();
      setAuditLog(data?.items || []);
    } catch {
      setAuditLog([]);
    }
  };

  const loadData = async (track = true) => {
    setLoadingOverview(true);
    try {
      const [podcastRes, overviewRes] = await Promise.all([fetch('/api/prototype/podcast'), fetch('/api/admin/overview')]);
      const podcastData = await podcastRes.json();
      const overviewData = await overviewRes.json();

      setEpisodes(podcastData?.episodes || []);
      setOverview(overviewData?.ok ? overviewData : null);
      if (track) await recordAudit('Atualização manual do dashboard', 'ok');
    } catch {
      setEpisodes([]);
      setOverview(null);
      if (track) await recordAudit('Falha ao atualizar dashboard', 'warn');
    } finally {
      await loadAudit();
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    (async () => {
      await recordAudit('Login no painel admin', 'ok');
      await Promise.all([loadData(false), loadAudit()]);
    })();
  }, []);

  useEffect(() => {
    loadAudit();
  }, [auditAdminFilter, auditStatusFilter, auditFrom, auditTo]);

  const handleLogout = async () => {
    await recordAudit('Logout do painel admin', 'ok');
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
      if (data?.ok) {
        setNotice('Podcast atualizado com sucesso.');
        await recordAudit('Episódios salvos no painel admin', 'ok', `total=${episodes.length}`);
      } else {
        setNotice('Falha ao salvar podcast.');
        await recordAudit('Falha ao salvar episódios', 'warn');
      }
      await loadAudit();
    } catch {
      setNotice('Erro ao salvar podcast.');
      await recordAudit('Erro de rede ao salvar episódios', 'warn');
      await loadAudit();
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

  const metrics = useMemo(() => {
    const secureAuth = Number(Boolean(overview?.auth?.google)) + Number(Boolean(overview?.auth?.github));
    const infraHealth = Number(Boolean(overview?.infra?.sql)) + Number(Boolean(overview?.infra?.openclawProxy));
    const withLinks = episodes.filter((e) => Boolean(e.link?.trim())).length;
    return [
      { label: 'OAuth score', value: secureAuth, max: 2 },
      { label: 'Infra score', value: infraHealth, max: 2 },
      { label: 'Episódios com link', value: withLinks, max: Math.max(episodes.length, 1) },
    ];
  }, [overview, episodes]);

  const filteredEpisodes = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return episodes.filter((ep) => {
      const bySearch =
        !normalized ||
        ep.title.toLowerCase().includes(normalized) ||
        ep.summary.toLowerCase().includes(normalized) ||
        ep.duration.toLowerCase().includes(normalized);

      const hasLink = Boolean(ep.link?.trim());
      const byFilter = filter === 'all' || (filter === 'withLink' ? hasLink : !hasLink);

      return bySearch && byFilter;
    });
  }, [episodes, search, filter]);

  const auditAdmins = useMemo(() => {
    const unique = new Set(auditLog.map((item) => item.adminLogin || 'admin'));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [auditLog]);

  const warnCount = useMemo(() => auditLog.filter((item) => item.status === 'warn').length, [auditLog]);

  const exportAuditCsv = () => {
    const rows = [
      ['createdAt', 'adminLogin', 'action', 'context', 'status'],
      ...auditLog.map((item) => [
        item.createdAt,
        item.adminLogin || 'admin',
        item.action,
        item.context || '',
        item.status,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `admin-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

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
            onClick={() => loadData(true)}
            disabled={loadingOverview}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-white/10 disabled:opacity-60"
          >
            {loadingOverview ? 'Atualizando...' : 'Atualizar status'}
          </button>
        </div>

        {warnCount > 0 && (
          <section className="mb-4 rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4">
            <p className="text-sm font-semibold text-amber-200">
              Alerta: {warnCount} evento(s) com status warn na auditoria. Revise os registros abaixo.
            </p>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map((m) => {
            const percent = Math.round((m.value / m.max) * 100);
            return (
              <article key={m.label} className={`${shellCard} p-4`}>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-300">{m.label}</p>
                <p className="text-2xl font-black text-cyan-200">{m.value}/{m.max}</p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${percent}%` }} />
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
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
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">Editor de Podcast</h3>
            <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-slate-300">{filteredEpisodes.length} resultados</span>
          </div>

          <p className="mb-4 mt-1 text-slate-300">Edite títulos, descrições e links com busca e filtros rápidos.</p>

          <div className="mb-4 grid gap-2 md:grid-cols-[1fr_auto]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, resumo ou duração..."
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-cyan-300/60"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'withLink' | 'withoutLink')}
              className="rounded-xl border border-white/20 bg-[#0b1222] px-3 py-2 text-white outline-none"
            >
              <option value="all">Todos</option>
              <option value="withLink">Com link</option>
              <option value="withoutLink">Sem link</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredEpisodes.map((ep) => (
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
            {filteredEpisodes.length === 0 && <p className="text-sm text-slate-300">Nenhum episódio encontrado para o filtro atual.</p>}
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

        <section className={`${shellCard} mt-6 p-6`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold">Auditoria real (SQL)</h3>
              <p className="mt-1 text-slate-300">Últimas ações administrativas persistidas no banco.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportAuditCsv}
                className="rounded-xl border border-white/20 px-3 py-1.5 text-sm font-semibold text-emerald-100 hover:bg-white/10"
              >
                Exportar CSV
              </button>
              <button
                onClick={loadAudit}
                className="rounded-xl border border-white/20 px-3 py-1.5 text-sm font-semibold text-cyan-100 hover:bg-white/10"
              >
                Atualizar auditoria
              </button>
            </div>
          </div>

          <div className="mb-4 grid gap-2 md:grid-cols-4">
            <select
              value={auditAdminFilter}
              onChange={(e) => setAuditAdminFilter(e.target.value)}
              className="rounded-xl border border-white/20 bg-[#0b1222] px-3 py-2 text-white outline-none"
            >
              <option value="all">Todos os admins</option>
              {auditAdmins.map((admin) => (
                <option key={admin} value={admin}>
                  {admin}
                </option>
              ))}
            </select>

            <select
              value={auditStatusFilter}
              onChange={(e) => setAuditStatusFilter(e.target.value as 'all' | 'ok' | 'warn')}
              className="rounded-xl border border-white/20 bg-[#0b1222] px-3 py-2 text-white outline-none"
            >
              <option value="all">Todos os status</option>
              <option value="ok">Somente ok</option>
              <option value="warn">Somente warn</option>
            </select>

            <input
              type="date"
              value={auditFrom}
              onChange={(e) => setAuditFrom(e.target.value)}
              className="rounded-xl border border-white/20 bg-[#0b1222] px-3 py-2 text-white outline-none"
            />

            <input
              type="date"
              value={auditTo}
              onChange={(e) => setAuditTo(e.target.value)}
              className="rounded-xl border border-white/20 bg-[#0b1222] px-3 py-2 text-white outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-300">
                  <th className="py-2 pr-2">Horário</th>
                  <th className="py-2 pr-2">Admin</th>
                  <th className="py-2 pr-2">Ação</th>
                  <th className="py-2 pr-2">Contexto</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((item) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="py-2 pr-2">{new Date(item.createdAt).toLocaleString('pt-BR')}</td>
                    <td className="py-2 pr-2">{item.adminLogin || 'admin'}</td>
                    <td className="py-2 pr-2">{item.action}</td>
                    <td className="py-2 pr-2 text-slate-300">{item.context || '—'}</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${item.status === 'ok' ? 'bg-emerald-400/20 text-emerald-200' : 'bg-amber-400/20 text-amber-200'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {auditLog.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-3 text-slate-300">
                      Sem registros de auditoria no momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
