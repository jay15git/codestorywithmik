"use client"

import {
  REVISIT_TAG_ID,
  STARRED_TAG_ID,
} from "@/lib/tags/constants"
import type {
  TagAssignmentsMap,
  TagCounts,
  TagState,
  UserTag,
} from "@/lib/tags/types"
import type { SolutionProgressMap } from "@/lib/progress/types"
import {
  getStudyBag,
  patchStudyBag,
  subscribeStudyBag,
} from "@/lib/storage/study-bag"

export {
  getTagIdsForSlug,
  hasTag,
  matchesAnyTagFilter,
  parseTagFilters,
} from "@/lib/tags/filters"

/** Stable empty snapshot for useSyncExternalStore (client + server). */
export const EMPTY_TAG_STATE: TagState = Object.freeze({
  definitions: [],
  assignments: Object.freeze({}),
})

export function subscribeToTags(listener: () => void) {
  return subscribeStudyBag(listener)
}

export function getServerTagState(): TagState {
  return EMPTY_TAG_STATE
}

export function readTagState(): TagState {
  if (typeof window === "undefined") {
    return EMPTY_TAG_STATE
  }

  return getStudyBag().tags
}

function writeTagState(tags: TagState) {
  patchStudyBag({ tags })
}

function uniqueIds(ids: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const id of ids) {
    if (!seen.has(id)) {
      seen.add(id)
      result.push(id)
    }
  }
  return result
}

function createTagId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `tag-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function listTags(state: TagState = readTagState()): UserTag[] {
  return state.definitions
}

export function getTagsForSlug(slug: string, state = readTagState()): string[] {
  return state.assignments[slug] ?? []
}

function clearSolvedForSlug(
  progress: SolutionProgressMap,
  slug: string,
): SolutionProgressMap {
  const entry = progress[slug]
  if (!entry?.solved) {
    return progress
  }

  const next = { ...progress }
  const cleaned = { ...entry }
  delete cleaned.solved
  if (Object.keys(cleaned).length === 0) {
    delete next[slug]
  } else {
    next[slug] = cleaned
  }
  return next
}

export function setTagsForSlug(slug: string, tagIds: string[]): TagState {
  const bag = getStudyBag()
  const state = bag.tags
  const assignments: TagAssignmentsMap = { ...state.assignments }
  const normalized = uniqueIds(tagIds)

  if (normalized.length === 0) {
    delete assignments[slug]
  } else {
    assignments[slug] = normalized
  }

  const nextTags = { ...state, assignments }
  const patch: { tags: TagState; progress?: SolutionProgressMap } = {
    tags: nextTags,
  }

  if (normalized.includes(REVISIT_TAG_ID)) {
    patch.progress = clearSolvedForSlug(bag.progress, slug)
  }

  patchStudyBag(patch)
  return nextTags
}

export function toggleTag(slug: string, tagId: string): TagState {
  const current = getTagsForSlug(slug)
  const hasIt = current.includes(tagId)
  const next = hasIt
    ? current.filter((id) => id !== tagId)
    : [...current, tagId]
  return setTagsForSlug(slug, next)
}

export function setTag(slug: string, tagId: string, value: boolean): TagState {
  const current = getTagsForSlug(slug)
  const has = current.includes(tagId)

  if (value && !has) {
    return setTagsForSlug(slug, [...current, tagId])
  }
  if (!value && has) {
    return setTagsForSlug(slug, current.filter((id) => id !== tagId))
  }
  return readTagState()
}

export function clearTag(slug: string, tagId: string): TagState {
  return setTag(slug, tagId, false)
}

export function createTag(name: string): UserTag {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error("Tag name is required")
  }

  const state = readTagState()
  const tag: UserTag = {
    id: createTagId(),
    name: trimmed,
    kind: "custom",
  }

  writeTagState({
    ...state,
    definitions: [...state.definitions, tag],
  })

  return tag
}

export function renameTag(tagId: string, name: string): UserTag | null {
  const trimmed = name.trim()
  if (!trimmed) {
    return null
  }

  const state = readTagState()
  const index = state.definitions.findIndex((tag) => tag.id === tagId)
  if (index === -1) {
    return null
  }

  const existing = state.definitions[index]
  if (existing.kind === "default") {
    return existing
  }

  const updated = { ...existing, name: trimmed }
  const definitions = [...state.definitions]
  definitions[index] = updated
  writeTagState({ ...state, definitions })
  return updated
}

export function deleteTag(tagId: string): TagState {
  const state = readTagState()
  const tag = state.definitions.find((item) => item.id === tagId)
  if (!tag || tag.kind === "default") {
    return state
  }

  const definitions = state.definitions.filter((item) => item.id !== tagId)
  const assignments: TagAssignmentsMap = {}

  for (const [slug, ids] of Object.entries(state.assignments)) {
    const filtered = ids.filter((id) => id !== tagId)
    if (filtered.length > 0) {
      assignments[slug] = filtered
    }
  }

  const next = { ...state, definitions, assignments }
  writeTagState(next)
  return next
}

export function countTagAssignments(state = readTagState()): TagCounts {
  let starred = 0
  let revisit = 0
  let custom = 0

  for (const ids of Object.values(state.assignments)) {
    if (ids.includes(STARRED_TAG_ID)) starred += 1
    if (ids.includes(REVISIT_TAG_ID)) revisit += 1
    for (const id of ids) {
      if (id !== STARRED_TAG_ID && id !== REVISIT_TAG_ID) {
        custom += 1
      }
    }
  }

  return { starred, revisit, custom }
}
