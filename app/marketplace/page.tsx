import type { Metadata } from "next";
import MarketplacePageClient from "./marketplace-page-client";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Marketplace de produtos e serviços premium com checkout integrado.",
  alternates: {
    canonical: "/marketplace",
  },
  openGraph: {
    title: "Marketplace | Hebert Paes",
    description: "Produtos e serviços no mesmo ecossistema com compra simplificada.",
    url: "/marketplace",
    type: "website",
    images: ["/openclaw-icon.svg"],
  },
  twitter: {
    card: "summary",
    title: "Marketplace | Hebert Paes",
    description: "Produtos e serviços premium em um único marketplace.",
  },
};

export default function MarketplacePage() {
  return <MarketplacePageClient />;
}
