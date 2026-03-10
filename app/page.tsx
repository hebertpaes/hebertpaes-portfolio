import type { Metadata } from "next";
import HomePageClient from "./home-page-client";

export const metadata: Metadata = {
  title: "Portfólio Oficial",
  description:
    "Portfólio oficial de Hebert Paes com podcast, cursos, marketplace e chat em uma experiência mobile-first.",
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
