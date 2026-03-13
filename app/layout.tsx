import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WebVitals from "./components/web-vitals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
};

const themeInitScript = `(() => {
  try {
    const key = 'hp-theme-mode';
    const saved = localStorage.getItem(key) || 'system';
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = saved === 'system' ? (systemDark ? 'dark' : 'light') : saved;
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-mode', saved);
  } catch (_) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
