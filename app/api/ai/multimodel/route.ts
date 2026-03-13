import { NextRequest, NextResponse } from "next/server";

type Provider = "openai" | "claude" | "gemini" | "llama" | "mistral";

const providerLabels: Record<Provider, string> = {
  openai: "OpenAI",
  claude: "Claude",
  gemini: "Gemini",
  llama: "Llama",
  mistral: "Mistral",
};

const playbooks: Record<Provider, string[]> = {
  openai: [
    "Sugira um plano de execução em 3 passos com foco em resultado rápido.",
    "Destaque KPIs críticos para medir impacto no negócio.",
  ],
  claude: [
    "Responda com linguagem clara, didática e orientada a decisão.",
    "Adicione riscos e mitigação para cada recomendação.",
  ],
  gemini: [
    "Estruture por blocos de análise, experimento e escala.",
    "Inclua sugestões para automação com dados multimodais.",
  ],
  llama: [
    "Priorize opção open-source e arquitetura com custo otimizado.",
    "Inclua stack técnica indicada para implantação rápida.",
  ],
  mistral: [
    "Responda com foco em latência baixa e inferência eficiente.",
    "Inclua estimativa de complexidade (baixa/média/alta).",
  ],
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const prompt = String(body?.prompt || "").trim();
  const provider = String(body?.provider || "openai") as Provider;

  if (!prompt) {
    return NextResponse.json({ ok: false, error: "Prompt inválido" }, { status: 400 });
  }

  const safeProvider = providerLabels[provider] ? provider : "openai";
  const guidance = playbooks[safeProvider].join(" ");

  const reply = `${providerLabels[safeProvider]} analisou sua solicitação: "${prompt}". ${guidance}`;

  return NextResponse.json({ ok: true, provider: safeProvider, reply });
}
