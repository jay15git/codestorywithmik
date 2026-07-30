"use client"

import type { SolutionLanguage } from "@/lib/content/solution-languages"
import {
  parseLanguageParam,
  pickPreferredLanguage,
} from "@/lib/preferences/language-param"
import {
  getStudyBag,
  patchStudyBag,
  subscribeStudyBag,
} from "@/lib/storage/study-bag"

export { parseLanguageParam, pickPreferredLanguage }

export const LANGUAGE_STORAGE_KEY = "solution-language-v1"

export function subscribeToLanguagePreference(listener: () => void) {
  return subscribeStudyBag(listener)
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
