"use client";

import { useRef, useState } from "react";

type RichEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function insertAtSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after = "",
  fallback = "texto"
) {
  const selected = value.slice(start, end) || fallback;
  return `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [mode, setMode] = useState<"markdown" | "html">("markdown");

  const apply = (type: "bold" | "italic" | "link" | "list" | "h2") => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const snippets = {
      markdown: {
        bold: ["**", "**", "negrito"],
        italic: ["*", "*", "italico"],
        link: ["[", "](https://)", "texto"],
        list: ["- item 1\n- item 2\n", "", ""],
        h2: ["## ", "", "titulo"],
      },
      html: {
        bold: ["<strong>", "</strong>", "negrito"],
        italic: ["<em>", "</em>", "italico"],
        link: ['<a href="https://">', "</a>", "texto"],
        list: ["<ul>\n  <li>item 1</li>\n  <li>item 2</li>\n</ul>\n", "", ""],
        h2: ["<h2>", "</h2>", "titulo"],
      },
    } as const;

    const [before, after, fallback] = snippets[mode][type];
    const nextValue = insertAtSelection(value, start, end, before, after, fallback);
    onChange(nextValue);

    const cursor = start + before.length + fallback.length;
    window.requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-white/20 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("markdown")}
            className={`rounded-md px-2 py-1 ${mode === "markdown" ? "bg-cyan-500 text-slate-950" : "text-slate-200"}`}
          >
            Markdown
          </button>
          <button
            type="button"
            onClick={() => setMode("html")}
            className={`rounded-md px-2 py-1 ${mode === "html" ? "bg-cyan-500 text-slate-950" : "text-slate-200"}`}
          >
            HTML
          </button>
        </div>

        <button type="button" onClick={() => apply("bold")} className="rounded-md border border-white/20 px-2 py-1 text-xs font-semibold">
          B
        </button>
        <button type="button" onClick={() => apply("italic")} className="rounded-md border border-white/20 px-2 py-1 text-xs italic">
          I
        </button>
        <button type="button" onClick={() => apply("link")} className="rounded-md border border-white/20 px-2 py-1 text-xs">
          Link
        </button>
        <button type="button" onClick={() => apply("list")} className="rounded-md border border-white/20 px-2 py-1 text-xs">
          Lista
        </button>
        <button type="button" onClick={() => apply("h2")} className="rounded-md border border-white/20 px-2 py-1 text-xs">
          Titulo
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        className="w-full rounded-xl border border-white/20 bg-[#070d1b] px-3 py-2 text-sm text-white outline-none"
        placeholder="Escreva o conteudo aqui (markdown ou HTML)."
      />
      <p className="mt-2 text-xs text-slate-300">Fallback seguro: o conteudo e salvo como texto, sem renderizacao automatica no admin.</p>
    </div>
  );
}
