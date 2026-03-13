import { NextRequest, NextResponse } from "next/server";
import { synthesizeAnswer } from "@/lib/ai-suite";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const task = String(body?.task || "").trim();
  const language = String(body?.language || "typescript");
  const model = String(body?.model || "claude") as any;

  if (!task) return NextResponse.json({ ok: false, error: "task obrigatória" }, { status: 400 });

  const plan = synthesizeAnswer("code", model, task);
  const snippet = `// ${task}\nexport function solveTask(){\n  return "Implementação inicial em ${language}";\n}`;

  return NextResponse.json({ ok: true, mode: "YouCode", model, language, plan, snippet });
}
