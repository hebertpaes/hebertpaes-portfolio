import { courses } from "@/lib/cursos-data";

const interestMap: Record<string, { title: string; message: string; categories: string[] }> = {
  negocios: {
    title: "Plano para Negócios",
    message: "Foco em crescimento de receita, oferta e operação enxuta.",
    categories: ["Negócios", "Vendas"],
  },
  marketing: {
    title: "Plano para Marketing",
    message: "Foco em aquisição, posicionamento e conteúdo de alto impacto.",
    categories: ["Marketing", "Conteúdo", "Tráfego"],
  },
  ia: {
    title: "Plano para IA",
    message: "Foco em automação, produtividade e escala com inteligência artificial.",
    categories: ["IA", "Negócios"],
  },
  vendas: {
    title: "Plano para Vendas",
    message: "Foco em funil, scripts, negociação e conversão.",
    categories: ["Vendas", "Negócios"],
  },
  conteudo: {
    title: "Plano para Conteúdo",
    message: "Foco em autoridade, audiência e distribuição multiplataforma.",
    categories: ["Conteúdo", "Marketing"],
  },
  trafego: {
    title: "Plano para Tráfego",
    message: "Foco em campanhas pagas e performance com ROI.",
    categories: ["Tráfego", "Marketing"],
  },
};

export function buildGuide(interestRaw: string, source: "cursos" | "marketplace" | "home") {
  const interest = (interestRaw || "").toLowerCase();
  const def = interestMap[interest] || interestMap.negocios;

  const recommended = courses
    .filter((c) => def.categories.includes(c.category))
    .slice(0, 3)
    .map((c, idx) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      step: idx + 1,
      action: source === "marketplace" ? `Combine com um produto/serviço para acelerar resultado em ${c.category}.` : `Estude este módulo para avançar em ${c.category}.`,
      href: `/cursos/${c.id}`,
    }));

  return {
    title: def.title,
    message: def.message,
    interest,
    source,
    recommended,
  };
}
