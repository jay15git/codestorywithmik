"use client"

import {
  SOLUTION_LANGUAGE_ORDER,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"
import type { SolutionNotesMap } from "@/lib/notes/types"
import type { SolutionProgressMap } from "@/lib/progress/types"
import { coerceSrsMap as coerceSrsMapFromLib } from "@/lib/srs/migrate-legacy"
import type { SrsMap } from "@/lib/srs/types"

import { idbGet, idbSet, STUDY_BAG_KEY } from "./idb"
import {
  buildStudyBagFromLegacyStorage,
  createEmptyStudyBag,
  LEGACY_STORAGE_KEYS,
} from "./migrate"
import type {
  StudyBag,
  StudyBagPatch,
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

function coerceProgressMap(value: unknown): SolutionProgressMap {
  return isRecord(value) ? (value as SolutionProgressMap) : {}
}

function coerceNotesMap(value: unknown): SolutionNotesMap {
  return isRecord(value) ? (value as SolutionNotesMap) : {}
}

function coerceSrsMap(value: unknown): SrsMap {
  return coerceSrsMapFromLib(value)
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

export function parseStudyBackup(json: unknown): StudyBag {
  if (!isRecord(json) || json.version !== 1) {
    throw new Error("Unsupported backup format")
  }

  return {
    version: 1,
    progress: coerceProgressMap(json.progress),
    notes: coerceNotesMap(json.notes),
    srs: coerceSrsMap(json.srs),
    language: coerceLanguage(json.language),
    viewMode: coerceViewMode(json.viewMode),
  }
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
      const stored = await idbGet<StudyBag>(STUDY_BAG_KEY)

      if (stored?.version === 1) {
        memoryBag = {
          version: 1,
          progress: coerceProgressMap(stored.progress),
          notes: coerceNotesMap(stored.notes),
          srs: coerceSrsMap(stored.srs),
          language: coerceLanguage(stored.language),
          viewMode: coerceViewMode(stored.viewMode),
        }
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
  memoryBag = {
    version: 1,
    progress: coerceProgressMap(bag.progress),
    notes: coerceNotesMap(bag.notes),
    srs: coerceSrsMap(bag.srs),
    language: coerceLanguage(bag.language),
    viewMode: coerceViewMode(bag.viewMode),
  }
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
