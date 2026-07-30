import {
  SOLUTION_LANGUAGE_ORDER,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"

export const LANGUAGE_STORAGE_KEY = "solution-language-v1"

const listeners = new Set<() => void>()

let cachedRaw: string | null | undefined
let cachedLanguage: SolutionLanguage | null = null

export function subscribeToLanguagePreference(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify() {
  listeners.forEach((listener) => listener())
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

  const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (raw === cachedRaw) {
    return cachedLanguage
  }

  cachedRaw = raw
  cachedLanguage = parseLanguageParam(raw)
  return cachedLanguage
}

export function getServerLanguagePreference(): SolutionLanguage | null {
  return null
}

export function writeLanguagePreference(language: SolutionLanguage) {
  if (
    typeof window !== "undefined" &&
    window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === language
  ) {
    cachedRaw = language
    cachedLanguage = language
    return
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  cachedRaw = language
  cachedLanguage = language
  notify()
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
