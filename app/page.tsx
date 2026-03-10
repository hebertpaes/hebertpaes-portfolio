import type { Metadata } from "next";
import HomePageClient from "./home-page-client";

export const metadata: Metadata = {
  title: "Blog de Notícias",
  description:
    "Portal estilo blog de notícias com visual editorial premium, foco mobile e navegação por editorias.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hebert Paes | Portfólio Oficial",
    description:
      "Podcast, cursos, marketplace e chat em uma experiência digital moderna e otimizada para mobile.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/openclaw-icon.svg",
        width: 1200,
        height: 630,
        alt: "Hebert Paes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hebert Paes | Portfólio Oficial",
    description: "Experiência digital com podcast, cursos, marketplace e chat.",
    images: ["/openclaw-icon.svg"],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
