"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "hp-theme-mode";

function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  const resolved = mode === "system" ? getSystemTheme() : mode;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.setAttribute("data-theme-mode", mode);
}

const options: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "🖥️" },
];

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || "system";
    setMode(saved);
    applyTheme(saved);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if ((localStorage.getItem(STORAGE_KEY) as ThemeMode | null) === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  function change(next: ThemeMode) {
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <div className="inline-flex items-center rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-1 text-xs">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => change(opt.value)}
          className={`rounded-lg px-2 py-1 transition ${mode === opt.value ? "bg-[var(--accent)] text-black" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
          title={opt.label}
          type="button"
        >
          <span className="mr-1">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
