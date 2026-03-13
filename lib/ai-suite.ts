export type AiMode = "search" | "chat" | "imagine" | "code" | "write";

export type Provider = "openai" | "claude" | "gemini" | "llama" | "mistral";

export type AgentProfile = {
  id: string;
  name: string;
  systemPrompt: string;
  preferredModel: Provider;
  createdAt: string;
};

const globalAgents = globalThis as unknown as {
  __hebertAgents?: AgentProfile[];
};

if (!globalAgents.__hebertAgents) {
  globalAgents.__hebertAgents = [
    {
      id: "research-analyst",
      name: "Research Analyst",
      systemPrompt: "Especialista em pesquisa, síntese e validação de fontes em tempo real.",
      preferredModel: "gemini",
      createdAt: new Date().toISOString(),
    },
    {
      id: "growth-copilot",
      name: "Growth Copilot",
      systemPrompt: "Especialista em marketing, funis e crescimento orientado a dados.",
      preferredModel: "openai",
      createdAt: new Date().toISOString(),
    },
  ];
}

export function listAgents() {
  return globalAgents.__hebertAgents ?? [];
}

export function createAgent(input: Omit<AgentProfile, "id" | "createdAt">) {
  const agent: AgentProfile = {
    id: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `agent-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...input,
  };
  globalAgents.__hebertAgents = [...listAgents(), agent];
  return agent;
}

export async function fetchRealtimeSources(query: string) {
  const safeQuery = encodeURIComponent(query);
  const sources: { title: string; url: string; snippet: string; source: string }[] = [];

  try {
    const hn = await fetch(`https://hn.algolia.com/api/v1/search?query=${safeQuery}&tags=story&hitsPerPage=3`, {
      next: { revalidate: 120 },
    });
    if (hn.ok) {
      const data = (await hn.json()) as { hits?: Array<{ title?: string; url?: string; story_text?: string }> };
      (data.hits || []).forEach((hit) => {
        if (!hit.title || !hit.url) return;
        sources.push({
          title: hit.title,
          url: hit.url,
          snippet: (hit.story_text || "Sem resumo disponível.").slice(0, 180),
          source: "Hacker News",
        });
      });
    }
  } catch {
    // fallback silencioso
  }

  if (sources.length === 0) {
    sources.push(
      {
        title: `Resumo em tempo real para: ${query}`,
        url: "https://hebertpaes.com/ai-platform",
        snippet: "Conector de fontes externas temporariamente indisponível; exibindo fallback local inteligente.",
        source: "Hebert IA Index",
      },
      {
        title: "OpenAI Platform Updates",
        url: "https://platform.openai.com/docs",
        snippet: "Referência técnica para integração de modelos, streaming e respostas estruturadas.",
        source: "OpenAI Docs",
      },
    );
  }

  return sources.slice(0, 6);
}

export function synthesizeAnswer(mode: AiMode, model: Provider, input: string) {
  const prefixes: Record<AiMode, string> = {
    search: "Resultado YouSearch-like",
    chat: "Resposta YouChat-like",
    imagine: "Prompt YouImagine-like",
    code: "Plano YouCode-like",
    write: "Texto YouWrite-like",
  };

  return `${prefixes[mode]} (${model}): processamento concluído para "${input}" com foco em precisão, velocidade e contexto.`;
}
