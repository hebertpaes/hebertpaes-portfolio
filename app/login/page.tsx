import type { Metadata } from "next";
import LoginPageClient from "./login-page-client";

export const metadata: Metadata = {
  title: "Login",
  description: "Acesse sua conta para conteúdo premium, área personalizada e recursos exclusivos.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Login | Hebert Paes",
    description: "Entre na sua conta para acessar conteúdos e recursos exclusivos.",
    url: "/login",
    type: "website",
    images: ["/openclaw-icon.svg"],
  },
  twitter: {
    card: "summary",
    title: "Login | Hebert Paes",
    description: "Acesso seguro à sua conta Hebert Paes.",
  },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
