import {
  SOLUTION_LANGUAGE_ORDER,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"

export function parseLanguageParam(
  value: string | undefined | null,
): SolutionLanguage | null {
  if (!value) {
    return null
  }

  const normalized = value.trim().toLowerCase()
  return SOLUTION_LANGUAGE_ORDER.includes(normalized as SolutionLanguage)
    ? (normalized as SolutionLanguage)
    : null
}

export function pickPreferredLanguage(
  available: SolutionLanguage[],
  preferred: SolutionLanguage | null,
  urlLang: SolutionLanguage | null,
): SolutionLanguage {
  if (available.length === 0) {
    return "cpp"
  }

  if (urlLang && available.includes(urlLang)) {
    return urlLang
  }

  if (preferred && available.includes(preferred)) {
    return preferred
  }

  return available[0]
}
