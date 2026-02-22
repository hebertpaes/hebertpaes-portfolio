import { NextRequest, NextResponse } from "next/server";
import { getSqlPool, sql } from "@/lib/sql";

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
    title: "Hebert Paes",
    summary: "Conteúdo em áudio disponível nas plataformas.",
    duration: "28 min",
    link: "https://music.youtube.com/playlist?list=OLAK5uy_mDljpGt6-_TCOS9EX1nG7RvQrDTsXJX0k&si=Ys2ZA9hDhSX45ukt",
  },
  {
    id: "ep2",
    title: "Hebert Paes",
    summary: "Conteúdo em áudio disponível nas plataformas.",
    duration: "34 min",
    link: "https://open.spotify.com/search/hebert%20paes",
  },
  {
    id: "ep3",
    title: "Hebert Paes",
    summary: "Conteúdo em áudio disponível nas plataformas.",
    duration: "31 min",
    link: "https://music.apple.com/br/search?term=hebert%20paes",
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

export async function GET() {
  try {
    const episodes = await seedIfEmpty();
    return NextResponse.json({ ok: true, episodes, source: "sql" });
  } catch {
    return NextResponse.json({ ok: true, episodes: getMemEpisodes(), source: "memory-fallback" });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.episodes)) {
    return NextResponse.json({ ok: false, error: "Payload inválido" }, { status: 400 });
  }

  const sanitized: Episode[] = body.episodes
    .filter((e: any) => e && e.id)
    .map((e: any) => ({
      id: String(e.id),
      title: String(e.title || "Hebert Paes"),
      summary: String(e.summary || "Conteúdo em áudio disponível nas plataformas."),
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
