import {
  SOLUTION_LANGUAGE_ORDER,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"
import type { SolutionNotesMap } from "@/lib/notes/types"
import type { SolutionProgressMap } from "@/lib/progress/types"
import { coerceSrsMap } from "@/lib/srs/migrate-legacy"

import type { StudyBag, ViewMode } from "./types"

export const LEGACY_STORAGE_KEYS = {
  progress: "solution-progress-v1",
  notes: "solution-notes-v1",
  srs: "solution-srs-v1",
  language: "solution-language-v1",
  viewMode: "solution-view-mode",
} as const

export function createEmptyStudyBag(): StudyBag {
  return {
    version: 1,
    progress: {},
    notes: {},
    srs: {},
    language: null,
    viewMode: "grid",
  }
}

function parseJsonRecord<T extends Record<string, unknown>>(
  raw: string | null,
): T | null {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null
    }
    return parsed as T
  } catch {
    return null
  }
}

function parseLanguage(raw: string | null): SolutionLanguage | null {
  if (!raw) {
    return null
  }

  const normalized = raw.trim().toLowerCase()
  return SOLUTION_LANGUAGE_ORDER.includes(normalized as SolutionLanguage)
    ? (normalized as SolutionLanguage)
    : null
}

function parseViewMode(raw: string | null): ViewMode {
  return raw === "list" ? "list" : "grid"
}

export function buildStudyBagFromLegacyStorage(
  getItem: (key: string) => string | null,
): { bag: StudyBag; keysToRemove: string[] } {
  const keysToRemove: string[] = []
  const bag = createEmptyStudyBag()

  const progressRaw = getItem(LEGACY_STORAGE_KEYS.progress)
  const progress = parseJsonRecord<SolutionProgressMap>(progressRaw)
  if (progress) {
    bag.progress = progress
    keysToRemove.push(LEGACY_STORAGE_KEYS.progress)
  }

  const notesRaw = getItem(LEGACY_STORAGE_KEYS.notes)
  const notes = parseJsonRecord<SolutionNotesMap>(notesRaw)
  if (notes) {
    bag.notes = notes
    keysToRemove.push(LEGACY_STORAGE_KEYS.notes)
  }

  const srsRaw = getItem(LEGACY_STORAGE_KEYS.srs)
  const srs = parseJsonRecord<Record<string, unknown>>(srsRaw)
  if (srs) {
    bag.srs = coerceSrsMap(srs)
    keysToRemove.push(LEGACY_STORAGE_KEYS.srs)
  }

  const languageRaw = getItem(LEGACY_STORAGE_KEYS.language)
  const language = parseLanguage(languageRaw)
  if (language) {
    bag.language = language
    keysToRemove.push(LEGACY_STORAGE_KEYS.language)
  }

  const viewModeRaw = getItem(LEGACY_STORAGE_KEYS.viewMode)
  if (viewModeRaw !== null) {
    bag.viewMode = parseViewMode(viewModeRaw)
    keysToRemove.push(LEGACY_STORAGE_KEYS.viewMode)
  }

  return { bag, keysToRemove }
}

export function hasLegacyStudyData(
  getItem: (key: string) => string | null,
): boolean {
  return Object.values(LEGACY_STORAGE_KEYS).some((key) => getItem(key) !== null)
}
