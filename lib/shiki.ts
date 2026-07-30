import { createHighlighter, type Highlighter, type ShikiTransformer } from "shiki"

import { sanitizeShikiHtml } from "@/lib/sanitize-shiki-html"

let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["cpp", "java", "python", "sql", "typescript"],
    })
  }

  return highlighterPromise
}

const lineNumbersTransformer: ShikiTransformer = {
  name: "line-numbers",
  pre(hast) {
    this.addClassToHast(hast, "shiki-line-numbers")
  },
}

export async function highlightCode(
  code: string,
  lang: "cpp" | "java" | "python" | "sql" | "typescript",
): Promise<string> {
  const highlighter = await getHighlighter()
  const html = highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    transformers: [lineNumbersTransformer],
  })

  return sanitizeShikiHtml(html)
}
