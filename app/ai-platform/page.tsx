import type { Metadata } from "next";
import AiPlatformClient from "./platform-client";

export const metadata: Metadata = {
  title: "AI Platform | Hebert Paes",
  description: "Hub avançado de IA com modos Search, Chat, Imagine, Code, Write e Agentes personalizados.",
  alternates: { canonical: "/ai-platform" },
};

export default function AiPlatformPage() {
  return <AiPlatformClient />;
}
