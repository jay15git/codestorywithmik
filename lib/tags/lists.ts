import type { TagAssignmentsMap, UserTag } from "@/lib/tags/types"

/** Virtual list id for every problem with at least one tag. */
export const ALL_SAVED_LIST_ID = "all"

export function getSlugsWithAnyTag(assignments: TagAssignmentsMap): string[] {
  return Object.entries(assignments)
    .filter(([, tagIds]) => tagIds.length > 0)
    .map(([slug]) => slug)
    .sort((left, right) => left.localeCompare(right))
}

export function getSlugsForTagId(
  assignments: TagAssignmentsMap,
  tagId: string,
): string[] {
  if (tagId === ALL_SAVED_LIST_ID) {
    return getSlugsWithAnyTag(assignments)
  }

  return Object.entries(assignments)
    .filter(([, tagIds]) => tagIds.includes(tagId))
    .map(([slug]) => slug)
    .sort((left, right) => left.localeCompare(right))
}

export function countSlugsForTagId(
  assignments: TagAssignmentsMap,
  tagId: string,
): number {
  return getSlugsForTagId(assignments, tagId).length
}

export function findTagById(
  definitions: UserTag[],
  tagId: string,
): UserTag | null {
  return definitions.find((tag) => tag.id === tagId) ?? null
}

export function getListTitle(tagId: string, tag: UserTag | null): string {
  if (tagId === ALL_SAVED_LIST_ID) {
    return "All saved"
  }
  return tag?.name ?? "List"
}

export function getListDescription(tagId: string, tag: UserTag | null): string {
  if (tagId === ALL_SAVED_LIST_ID) {
    return "Every problem you tagged on a solution page."
  }
  if (tag?.kind === "default") {
    return `Problems tagged ${tag.name}.`
  }
  if (tag) {
    return `Your custom list: ${tag.name}.`
  }
  return "Saved problems in this browser."
}

export function isKnownListId(
  tagId: string,
  definitions: UserTag[],
): boolean {
  if (tagId === ALL_SAVED_LIST_ID) {
    return true
  }
  return definitions.some((tag) => tag.id === tagId)
}
