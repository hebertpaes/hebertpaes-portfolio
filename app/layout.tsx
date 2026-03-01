import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://hebertpaes.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hebert Paes | Portfólio Oficial",
    template: "%s | Hebert Paes",
  },
  description: "Portfólio oficial de Hebert Paes com podcast, chat e novidades em um layout moderno e responsivo.",
  applicationName: "Hebert Paes",
  manifest: "/manifest.webmanifest",
  keywords: ["Hebert Paes", "podcast", "portfólio", "música", "chat"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Hebert Paes",
    title: "Hebert Paes | Portfólio Oficial",
    description: "Visual inovador com podcast, loja em reformulação e atendimento direto no chat Jabes.",
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
    description: "Acesse o portfólio oficial com design moderno, podcast em destaque e chat integrado.",
    images: ["/openclaw-icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/openclaw-icon.svg",
    shortcut: "/openclaw-icon.svg",
    apple: "/openclaw-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f5f9" },
    { media: "(prefers-color-scheme: dark)", color: "#04070f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
