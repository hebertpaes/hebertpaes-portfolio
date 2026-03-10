import type { Metadata } from "next";
import PodcastPageClient from "./podcast-page-client";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Episódios sobre tecnologia, automação, produto e execução com foco prático.",
  alternates: {
    canonical: "/podcast",
  },
  openGraph: {
    title: "Podcast | Hebert Paes",
    description: "Conteúdo direto e prático sobre tecnologia, automação e execução.",
    url: "/podcast",
    type: "website",
    images: ["/openclaw-icon.svg"],
  },
  twitter: {
    card: "summary",
    title: "Podcast | Hebert Paes",
    description: "Episódios com foco em tecnologia, automação e execução.",
  },
};

export default function PodcastPage() {
  return <PodcastPageClient />;
}
