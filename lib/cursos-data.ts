export type Course = {
  id: string;
  title: string;
  creator: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  students: string;
  price: string;
  category: string;
  accent: string;
};

export type CourseModule = {
  id: string;
  title: string;
  lessons: Array<{ id: string; title: string; minutes: number; videoUrl: string }>;
};

export const courses: Course[] = [
  {
    id: "c1",
    title: "Máquina de Vendas com IA",
    creator: "Hebert Paes",
    level: "Intermediário",
    duration: "12h 40m",
    students: "2.9k alunos",
    price: "R$ 697",
    category: "IA",
    accent: "from-cyan-400/80 to-blue-500/80",
  },
  {
    id: "c2",
    title: "Conteúdo Magnético para Redes",
    creator: "Hebert Paes",
    level: "Iniciante",
    duration: "8h 10m",
    students: "4.2k alunos",
    price: "R$ 397",
    category: "Conteúdo",
    accent: "from-fuchsia-400/80 to-violet-500/80",
  },
  {
    id: "c3",
    title: "Tráfego Pago de Alta Conversão",
    creator: "Time HP Academy",
    level: "Avançado",
    duration: "16h 20m",
    students: "1.6k alunos",
    price: "R$ 997",
    category: "Tráfego",
    accent: "from-amber-300/80 to-orange-500/80",
  },
  {
    id: "c4",
    title: "Escala de Negócios Digitais",
    creator: "Hebert Paes",
    level: "Intermediário",
    duration: "10h 05m",
    students: "1.2k alunos",
    price: "R$ 597",
    category: "Negócios",
    accent: "from-emerald-300/80 to-teal-500/80",
  },
];

export const courseModulesById: Record<string, CourseModule[]> = {
  c1: [
    {
      id: "m1",
      title: "Fundamentos da máquina de vendas",
      lessons: [
        { id: "l1", title: "Arquitetura do funil", minutes: 22, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { id: "l2", title: "Oferta irresistível", minutes: 18, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      ],
    },
    {
      id: "m2",
      title: "Automação com IA",
      lessons: [
        { id: "l3", title: "Prompts de vendas", minutes: 25, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { id: "l4", title: "CRM e follow-up", minutes: 20, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      ],
    },
  ],
};
