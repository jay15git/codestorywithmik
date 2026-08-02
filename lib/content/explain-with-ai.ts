import {
  SOLUTION_LANGUAGE_LABELS,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"
import type { Difficulty } from "@/lib/content/types"

/** Keep under common browser / AI deep-link query length limits. */
export const AI_PROMPT_MAX_CHARS = 1800

export type AiProvider = "chatgpt" | "claude" | "gemini"

export interface ExplainWithAiInput {
  title: string
  language: SolutionLanguage
  code: string
  topic?: string | null
  difficulty?: Difficulty | null
  timeComplexity?: string | null
  spaceComplexity?: string | null
  leetcodeUrl?: string | null
  gfgUrl?: string | null
}

export const AI_PROVIDERS: {
  id: AiProvider
  label: string
  buildUrl: (prompt: string) => string
}[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    buildUrl: (prompt) =>
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "claude",
    label: "Claude",
    buildUrl: (prompt) =>
      `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "gemini",
    label: "Gemini",
    buildUrl: (prompt) =>
      `https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`,
  },
]

function fenceLanguage(language: SolutionLanguage): string {
  switch (language) {
    case "cpp":
      return "cpp"
    case "python":
      return "python"
    case "typescript":
      return "typescript"
    case "sql":
      return "sql"
    case "java":
      return "java"
  }
}

function buildPromptBody(input: ExplainWithAiInput, code: string): string {
  const lines: string[] = [
    "Explain this coding interview solution in detail.",
    "",
    `Problem: ${input.title}`,
  ]

  if (input.topic) {
    lines.push(`Topic: ${input.topic}`)
  }
  if (input.difficulty) {
    lines.push(`Difficulty: ${input.difficulty}`)
  }

  lines.push(`Language: ${SOLUTION_LANGUAGE_LABELS[input.language]}`)

  if (input.timeComplexity) {
    lines.push(`Time complexity: ${input.timeComplexity}`)
  }
  if (input.spaceComplexity) {
    lines.push(`Space complexity: ${input.spaceComplexity}`)
  }

  const practiceUrl = input.leetcodeUrl ?? input.gfgUrl
  if (practiceUrl) {
    lines.push(`Practice link: ${practiceUrl}`)
  }

  lines.push(
    "",
    "Code:",
    `\`\`\`${fenceLanguage(input.language)}`,
    code,
    "```",
    "",
    "Please cover:",
    "1. Problem restatement in plain language",
    "2. Core intuition and approach",
    "3. Step-by-step walkthrough of the code",
    "4. Why the stated time/space complexity is correct (or correct it)",
    "5. Edge cases and common pitfalls",
    "6. Brief alternative approaches",
  )

  return lines.join("\n")
}

/**
 * Builds a detailed explain-this-solution prompt, truncating code if needed
 * so the full prompt fits AI deep-link URL limits.
 */
export function buildExplainPrompt(input: ExplainWithAiInput): string {
  const trimmedCode = input.code.trim()
  let prompt = buildPromptBody(input, trimmedCode)

  if (prompt.length <= AI_PROMPT_MAX_CHARS) {
    return prompt
  }

  const overhead = buildPromptBody(input, "").length + 80
  const budget = Math.max(200, AI_PROMPT_MAX_CHARS - overhead)
  const truncated =
    trimmedCode.slice(0, budget).trimEnd() +
    "\n\n// ... truncated for URL length; ask me if you need the rest"

  prompt = buildPromptBody(input, truncated)

  if (prompt.length <= AI_PROMPT_MAX_CHARS) {
    return prompt
  }

  return prompt.slice(0, AI_PROMPT_MAX_CHARS)
}

export function buildAiProviderUrl(
  provider: AiProvider,
  prompt: string,
): string {
  const entry = AI_PROVIDERS.find((item) => item.id === provider)
  if (!entry) {
    throw new Error(`Unknown AI provider: ${provider}`)
  }
  return entry.buildUrl(prompt)
}
