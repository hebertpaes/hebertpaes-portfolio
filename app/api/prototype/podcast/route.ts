import { NextRequest, NextResponse } from "next/server";

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

const g = globalThis as typeof globalThis & { __podcastEpisodes?: Episode[] };

function getEpisodes() {
  if (!g.__podcastEpisodes) g.__podcastEpisodes = defaultEpisodes;
  return g.__podcastEpisodes;
}

export async function GET() {
  return NextResponse.json({ ok: true, episodes: getEpisodes() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.episodes)) {
    return NextResponse.json({ ok: false, error: "Payload inválido" }, { status: 400 });
  }

  const sanitized = body.episodes
    .filter((e: any) => e && e.id)
    .map((e: any) => ({
      id: String(e.id),
      title: String(e.title || "Hebert Paes"),
      summary: String(e.summary || "Conteúdo em áudio disponível nas plataformas."),
      duration: String(e.duration || "--"),
      link: String(e.link || "#"),
    }));

  g.__podcastEpisodes = sanitized;
  return NextResponse.json({ ok: true, episodes: sanitized });
}
