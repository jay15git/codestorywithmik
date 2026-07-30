"use client"

import type { SolutionNoteEntry, SolutionNotesMap } from "@/lib/notes/types"
import {
  getStudyBag,
  patchStudyBag,
  subscribeStudyBag,
} from "@/lib/storage/study-bag"

export const NOTES_STORAGE_KEY = "solution-notes-v1"

export const EMPTY_NOTES_MAP: SolutionNotesMap = Object.freeze({})

export function subscribeToNotes(listener: () => void) {
  return subscribeStudyBag(listener)
}

export function getServerNotesMap(): SolutionNotesMap {
  return EMPTY_NOTES_MAP
}

export function readNotesMap(): SolutionNotesMap {
  if (typeof window === "undefined") {
    return EMPTY_NOTES_MAP
  }

  const notes = getStudyBag().notes
  return Object.keys(notes).length === 0 ? EMPTY_NOTES_MAP : notes
}

function writeNotesMap(map: SolutionNotesMap) {
  patchStudyBag({
    notes: Object.keys(map).length === 0 ? {} : map,
  })
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
