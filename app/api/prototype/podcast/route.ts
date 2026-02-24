import { NextRequest, NextResponse } from "next/server";
import { getSqlPool, sql } from "@/lib/sql";
import { hasValidSession } from "@/lib/auth-guard";

type Episode = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  link: string;
};

const defaultEpisodes: Episode[] = [
  {
    id: "ep1",
    title: "Automação prática para negócios locais",
    summary: "Como automatizar processos de atendimento sem perder qualidade.",
    duration: "22 min",
    link: "#",
  },
  {
    id: "ep2",
    title: "Execução sem enrolação",
    summary: "Framework simples para sair do planejamento e entrar em produção.",
    duration: "27 min",
    link: "#",
  },
  {
    id: "ep3",
    title: "Produto, vendas e consistência",
    summary: "Estratégias para manter ritmo de entrega com foco em resultado.",
    duration: "30 min",
    link: "#",
  },
];

const g = globalThis as typeof globalThis & { __podcastEpisodesMem?: Episode[] };

function getMemEpisodes() {
  if (!g.__podcastEpisodesMem) g.__podcastEpisodesMem = defaultEpisodes;
  return g.__podcastEpisodesMem;
}

async function ensureTable() {
  const pool = await getSqlPool();
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'podcast_episodes'
    )
    BEGIN
      CREATE TABLE dbo.podcast_episodes (
        id NVARCHAR(64) NOT NULL PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        summary NVARCHAR(1000) NOT NULL,
        duration NVARCHAR(64) NOT NULL,
        link NVARCHAR(1000) NOT NULL,
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END
  `);
}

async function readDbEpisodes(): Promise<Episode[]> {
  await ensureTable();
  const pool = await getSqlPool();
  const result = await pool.request().query(`
    SELECT id, title, summary, duration, link
    FROM dbo.podcast_episodes
    ORDER BY id ASC
  `);
  return result.recordset as Episode[];
}

async function seedIfEmpty() {
  const existing = await readDbEpisodes();
  if (existing.length > 0) return existing;

  const pool = await getSqlPool();
  for (const ep of defaultEpisodes) {
    await pool
      .request()
      .input("id", sql.NVarChar(64), ep.id)
      .input("title", sql.NVarChar(255), ep.title)
      .input("summary", sql.NVarChar(1000), ep.summary)
      .input("duration", sql.NVarChar(64), ep.duration)
      .input("link", sql.NVarChar(1000), ep.link)
      .query(`
        INSERT INTO dbo.podcast_episodes (id, title, summary, duration, link)
        VALUES (@id, @title, @summary, @duration, @link)
      `);
  }

  return await readDbEpisodes();
}

export async function GET(req: NextRequest) {
  if (!hasValidSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const episodes = await seedIfEmpty();
    return NextResponse.json({ ok: true, episodes, source: "sql" });
  } catch {
    return NextResponse.json({ ok: true, episodes: getMemEpisodes(), source: "memory-fallback" });
  }
}

export async function POST(req: NextRequest) {
  if (!hasValidSession(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.episodes)) {
    return NextResponse.json({ ok: false, error: "Payload inválido" }, { status: 400 });
  }

  const sanitized: Episode[] = body.episodes
    .filter((e: any) => e && e.id)
    .map((e: any) => ({
      id: String(e.id),
      title: String(e.title || "Hebert Paes"),
      summary: String(e.summary || "Episódio do podcast com conteúdo prático e direto."),
      duration: String(e.duration || "--"),
      link: String(e.link || "#"),
    }));

  try {
    await ensureTable();
    const pool = await getSqlPool();

    for (const ep of sanitized) {
      await pool
        .request()
        .input("id", sql.NVarChar(64), ep.id)
        .input("title", sql.NVarChar(255), ep.title)
        .input("summary", sql.NVarChar(1000), ep.summary)
        .input("duration", sql.NVarChar(64), ep.duration)
        .input("link", sql.NVarChar(1000), ep.link)
        .query(`
          MERGE dbo.podcast_episodes AS target
          USING (SELECT @id AS id) AS source
          ON target.id = source.id
          WHEN MATCHED THEN
            UPDATE SET
              title = @title,
              summary = @summary,
              duration = @duration,
              link = @link,
              updated_at = SYSUTCDATETIME()
          WHEN NOT MATCHED THEN
            INSERT (id, title, summary, duration, link)
            VALUES (@id, @title, @summary, @duration, @link);
        `);
    }

    const keepIds = sanitized.map((e) => `'${e.id.replace(/'/g, "''")}'`).join(",");
    if (keepIds) {
      await pool.request().query(`DELETE FROM dbo.podcast_episodes WHERE id NOT IN (${keepIds})`);
    }

    const episodes = await readDbEpisodes();
    return NextResponse.json({ ok: true, episodes, source: "sql" });
  } catch {
    g.__podcastEpisodesMem = sanitized;
    return NextResponse.json({ ok: true, episodes: sanitized, source: "memory-fallback" });
  }
}
