import type { SolutionCode } from "./types"
import type { WalkcccLanguageExtension } from "./walkccc-source"

export type SolutionLanguage = "cpp" | "java" | "python" | "sql" | "typescript"
export type SolutionShikiLanguage =
  | "cpp"
  | "java"
  | "python"
  | "sql"
  | "typescript"

export const SOLUTION_LANGUAGE_ORDER: SolutionLanguage[] = [
  "cpp",
  "java",
  "python",
  "sql",
  "typescript",
]

export const SOLUTION_LANGUAGE_LABELS: Record<SolutionLanguage, string> = {
  cpp: "C++",
  java: "Java",
  python: "Python",
  sql: "SQL",
  typescript: "TypeScript",
}

export const SOLUTION_LANGUAGE_SHIKI: Record<
  SolutionLanguage,
  SolutionShikiLanguage
> = {
  cpp: "cpp",
  java: "java",
  python: "python",
  sql: "sql",
  typescript: "typescript",
}

export const WALKCCC_EXTENSION_TO_LANGUAGE: Record<
  WalkcccLanguageExtension,
  SolutionLanguage
> = {
  cpp: "cpp",
  java: "java",
  py: "python",
  sql: "sql",
  ts: "typescript",
}

export const LANGUAGE_TO_GENERATED_EXTENSION: Record<SolutionLanguage, string> =
  {
    cpp: "cpp",
    java: "java",
    python: "py",
    sql: "sql",
    typescript: "ts",
  }

export function getAvailableLanguages(
  code: SolutionCode,
): SolutionLanguage[] {
  return SOLUTION_LANGUAGE_ORDER.filter((language) => Boolean(code[language]))
}
