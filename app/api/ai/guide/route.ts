import { NextRequest, NextResponse } from "next/server";
import { buildGuide } from "@/lib/ai-guide";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const interest = String(body?.interest || "negocios");
  const source = String(body?.source || "home") as "cursos" | "marketplace" | "home";

  const guide = buildGuide(interest, source);
  return NextResponse.json({ ok: true, guide });
}
