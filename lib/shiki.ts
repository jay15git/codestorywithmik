import { createHighlighter, type Highlighter, type ShikiTransformer } from "shiki"

let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["cpp", "java"],
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
  lang: "cpp" | "java",
): Promise<string> {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    transformers: [lineNumbersTransformer],
  })
}
