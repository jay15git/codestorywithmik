import type { TagAssignmentsMap } from "@/lib/tags/types"
import { ALL_SAVED_LIST_ID } from "@/lib/tags/lists"

export function parseTagFilters(value: string | undefined): string[] {
  if (!value) {
    return []
  }

  const seen = new Set<string>()
  for (const part of value.split(",")) {
    const trimmed = part.trim()
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed)
    }
  }
  return [...seen]
}

export function getTagIdsForSlug(
  assignments: TagAssignmentsMap,
  slug: string,
): string[] {
  return assignments[slug] ?? []
}

export function hasTag(
  assignments: TagAssignmentsMap,
  slug: string,
  tagId: string,
): boolean {
  return getTagIdsForSlug(assignments, slug).includes(tagId)
}

export function matchesAnyTagFilter(
  assignments: TagAssignmentsMap,
  slug: string,
  tagIds: string[],
): boolean {
  if (tagIds.length === 0) {
    return true
  }

  const assigned = getTagIdsForSlug(assignments, slug)
  const wantsAllSaved = tagIds.includes(ALL_SAVED_LIST_ID)
  const concreteTagIds = tagIds.filter((id) => id !== ALL_SAVED_LIST_ID)

  if (wantsAllSaved && assigned.length > 0) {
    return true
  }

  if (concreteTagIds.length === 0) {
    return false
  }

  return concreteTagIds.some((tagId) => assigned.includes(tagId))
}
