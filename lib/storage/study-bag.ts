"use client"

import {
  SOLUTION_LANGUAGE_ORDER,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"
import type { SolutionProgressMap } from "@/lib/progress/types"
import { coerceTagState } from "@/lib/tags/migrate"

import { idbGet, idbSet, STUDY_BAG_KEY } from "./idb"
import {
  buildStudyBagFromLegacyStorage,
  createEmptyStudyBag,
  migrateStudyBagV1ToV2,
  LEGACY_STORAGE_KEYS,
} from "./migrate"
import type {
  LegacyProgressEntry,
  StudyBag,
  StudyBagPatch,
  StudyBagV1,
  StudyBackup,
  ViewMode,
} from "./types"

const listeners = new Set<() => void>()

let memoryBag: StudyBag = createEmptyStudyBag()
let hydrated = false
let hydratePromise: Promise<void> | null = null

function notify() {
  listeners.forEach((listener) => listener())
}

function persistBag(bag: StudyBag) {
  if (typeof window === "undefined") {
    return
  }

  void idbSet(STUDY_BAG_KEY, bag).catch((error) => {
    console.error("Failed to persist study bag", error)
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function coerceLegacyProgressMap(
  value: unknown,
): Record<string, LegacyProgressEntry> {
  if (!isRecord(value)) {
    return {}
  }

  const result: Record<string, LegacyProgressEntry> = {}
  for (const [slug, entry] of Object.entries(value)) {
    if (!isRecord(entry)) {
      continue
    }
    const legacy: LegacyProgressEntry = {}
    if (entry.solved) legacy.solved = true
    if (entry.starred) legacy.starred = true
    if (Object.keys(legacy).length > 0) {
      result[slug] = legacy
    }
  }
  return result
}

function coerceProgressMap(value: unknown): SolutionProgressMap {
  if (!isRecord(value)) {
    return {}
  }

  const result: SolutionProgressMap = {}
  for (const [slug, entry] of Object.entries(value)) {
    if (!isRecord(entry)) {
      continue
    }
    if (entry.solved) {
      result[slug] = { solved: true }
    }
  }
  return result
}

function coerceLanguage(value: unknown): SolutionLanguage | null {
  if (typeof value !== "string") {
    return null
  }

  const normalized = value.trim().toLowerCase()
  return SOLUTION_LANGUAGE_ORDER.includes(normalized as SolutionLanguage)
    ? (normalized as SolutionLanguage)
    : null
}

function coerceViewMode(value: unknown): ViewMode {
  return value === "list" ? "list" : "grid"
}

function normalizeStudyBag(json: unknown): StudyBag {
  if (!isRecord(json)) {
    throw new Error("Unsupported backup format")
  }

  const version = json.version
  if (version !== 1 && version !== 2) {
    throw new Error("Unsupported backup format")
  }

  if (version === 2) {
    return {
      version: 2,
      progress: coerceProgressMap(json.progress),
      language: coerceLanguage(json.language),
      viewMode: coerceViewMode(json.viewMode),
      tags: coerceTagState(json.tags),
    }
  }

  const v1: StudyBagV1 = {
    version: 1,
    progress: coerceLegacyProgressMap(json.progress),
    language: coerceLanguage(json.language),
    viewMode: coerceViewMode(json.viewMode),
  }

  return migrateStudyBagV1ToV2(v1)
}

export function parseStudyBackup(json: unknown): StudyBag {
  return normalizeStudyBag(json)
}

export function subscribeStudyBag(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getServerStudyBag(): StudyBag {
  return createEmptyStudyBag()
}

export function getStudyBag(): StudyBag {
  return memoryBag
}

export function isStudyBagHydrated(): boolean {
  return hydrated
}

export function hydrateStudyBag(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve()
  }

  if (hydrated) {
    return Promise.resolve()
  }

  if (!hydratePromise) {
    hydratePromise = (async () => {
      const stored = await idbGet<StudyBag | StudyBagV1>(STUDY_BAG_KEY)

      if (stored?.version === 2) {
        memoryBag = normalizeStudyBag(stored)
      } else if (stored?.version === 1) {
        memoryBag = migrateStudyBagV1ToV2(stored)
        await idbSet(STUDY_BAG_KEY, memoryBag)
      } else {
        const { bag, keysToRemove } = buildStudyBagFromLegacyStorage((key) =>
          window.localStorage.getItem(key),
        )
        memoryBag = bag
        await idbSet(STUDY_BAG_KEY, bag)
        for (const key of keysToRemove) {
          window.localStorage.removeItem(key)
        }
      }

      hydrated = true
      notify()
    })().catch((error) => {
      hydratePromise = null
      console.error("Failed to hydrate study bag", error)
      throw error
    })
  }

  return hydratePromise
}

export function patchStudyBag(patch: StudyBagPatch): StudyBag {
  memoryBag = {
    ...memoryBag,
    ...patch,
  }
  notify()
  persistBag(memoryBag)
  return memoryBag
}

export function replaceStudyBag(bag: StudyBag): StudyBag {
  memoryBag = normalizeStudyBag(bag)
  notify()
  persistBag(memoryBag)
  return memoryBag
}

export function clearStudyBag(): StudyBag {
  memoryBag = createEmptyStudyBag()
  notify()
  persistBag(memoryBag)
  return memoryBag
}

export function exportStudyBag(): StudyBackup {
  return {
    ...memoryBag,
    exportedAt: new Date().toISOString(),
  }
}

/** @internal test helper */
export function resetStudyBagForTests(bag: StudyBag = createEmptyStudyBag()) {
  memoryBag = bag
  hydrated = false
  hydratePromise = null
  listeners.clear()
}

export { LEGACY_STORAGE_KEYS }
