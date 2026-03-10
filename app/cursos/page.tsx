import type { Metadata } from "next";
import CursosPageClient from "./cursos-page-client";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Catálogo de cursos com experiência premium, área de membros e checkout integrado.",
  alternates: {
    canonical: "/cursos",
  },
  openGraph: {
    title: "Cursos | Hebert Paes",
    description: "Portal de cursos com conteúdo em vídeo, checkout e recursos para creators.",
    url: "/cursos",
    type: "website",
    images: ["/openclaw-icon.svg"],
  },
  twitter: {
    card: "summary",
    title: "Cursos | Hebert Paes",
    description: "Portal de cursos e monetização para creators.",
  },
};

export default function CursosPage() {
  return <CursosPageClient />;
}
