import type { SolutionNoteEntry, SolutionNotesMap } from "@/lib/notes/types"

export const NOTES_STORAGE_KEY = "solution-notes-v1"

export const EMPTY_NOTES_MAP: SolutionNotesMap = Object.freeze({})

const listeners = new Set<() => void>()

let cachedRaw: string | null | undefined
let cachedMap: SolutionNotesMap = EMPTY_NOTES_MAP

function notify() {
  listeners.forEach((listener) => listener())
}

export function subscribeToNotes(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getServerNotesMap(): SolutionNotesMap {
  return EMPTY_NOTES_MAP
}

export function readNotesMap(): SolutionNotesMap {
  if (typeof window === "undefined") {
    return EMPTY_NOTES_MAP
  }

  const raw = window.localStorage.getItem(NOTES_STORAGE_KEY)
  if (raw === cachedRaw) {
    return cachedMap
  }

  cachedRaw = raw

  if (!raw) {
    cachedMap = EMPTY_NOTES_MAP
    return cachedMap
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") {
      cachedMap = EMPTY_NOTES_MAP
      return cachedMap
    }

    cachedMap = parsed as SolutionNotesMap
    return cachedMap
  } catch {
    cachedMap = EMPTY_NOTES_MAP
    return cachedMap
  }
}

function writeNotesMap(map: SolutionNotesMap) {
  const raw = JSON.stringify(map)
  window.localStorage.setItem(NOTES_STORAGE_KEY, raw)
  cachedRaw = raw
  cachedMap = Object.keys(map).length === 0 ? EMPTY_NOTES_MAP : map
  notify()
}

export function getNoteEntry(
  map: SolutionNotesMap,
  slug: string,
): SolutionNoteEntry | null {
  const entry = map[slug]
  if (!entry || !entry.markdown.trim()) {
    return null
  }
  return entry
}

export function readNoteMarkdown(slug: string): string {
  return readNotesMap()[slug]?.markdown ?? ""
}

export function writeNoteMarkdown(slug: string, markdown: string): void {
  const map = { ...readNotesMap() }
  const trimmed = markdown.trimEnd()

  if (!trimmed.trim()) {
    delete map[slug]
  } else {
    map[slug] = {
      markdown: trimmed,
      updatedAt: new Date().toISOString(),
    }
  }

  writeNotesMap(map)
}
