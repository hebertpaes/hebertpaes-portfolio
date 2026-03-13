import type { Metadata } from "next";
import NewsHomePageClient from "./news-home-page-client";

export const metadata: Metadata = {
  title: "Notícias",
  description:
    "Portal estilo blog de notícias com visual editorial premium, foco mobile e navegação por editorias.",
  alternates: {
    canonical: "/noticias",
  },
};

export default function NoticiasPage() {
  return <NewsHomePageClient />;
}
