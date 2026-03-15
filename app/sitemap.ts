import type { MetadataRoute } from "next";

const baseUrl = "https://hebertpaes.com";

const routes = [
  "/",
  "/chat",
  "/noticias",
  "/cursos",
  "/cursos/minha-area",
  "/cursos/checkout",
  "/marketplace",
  "/marketplace/checkout",
  "/marketplace/sucesso",
  "/podcast",
  "/dashboard",
  "/login",
  "/admin",
  "/admin/login",
  "/admin/2fa",
  "/admin/dashboard",
  "/admin/cms",
  "/openclaw",
  "/openclaw/status",
  "/openclaw/agents",
  "/openclaw/sessions",
  "/openclaw/automations",
  "/openclaw/chat",
  "/openclaw/app",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
