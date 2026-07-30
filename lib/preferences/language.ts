import {
  SOLUTION_LANGUAGE_ORDER,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"
import {
  getStudyBag,
  patchStudyBag,
  subscribeStudyBag,
} from "@/lib/storage/study-bag"

export const LANGUAGE_STORAGE_KEY = "solution-language-v1"

export function subscribeToLanguagePreference(listener: () => void) {
  return subscribeStudyBag(listener)
}

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

export function readLanguagePreference(): SolutionLanguage | null {
  if (typeof window === "undefined") {
    return null
  }

  return getStudyBag().language
}

export function getServerLanguagePreference(): SolutionLanguage | null {
  return null
}

export function writeLanguagePreference(language: SolutionLanguage) {
  if (typeof window !== "undefined" && getStudyBag().language === language) {
    return
  }

  patchStudyBag({ language })
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
