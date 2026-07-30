"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import {
  countTagAssignments,
  createTag,
  deleteTag,
  getServerTagState,
  getTagsForSlug,
  listTags,
  readTagState,
  setTag,
  setTagsForSlug,
  subscribeToTags,
  toggleTag,
} from "@/lib/tags/store"
import type { TagCounts, UserTag } from "@/lib/tags/types"
import { hasTag } from "@/lib/tags/filters"

async function scheduleRevisit(slug: string) {
  const { markDueToday } = await import("@/lib/srs/store")
  markDueToday(slug)
}

interface SolutionTagsContextValue {
  tags: UserTag[]
  assignments: Record<string, string[]>
  counts: TagCounts
  getTagIds: (slug: string) => string[]
  hasTag: (slug: string, tagId: string) => boolean
  toggleTag: (slug: string, tagId: string) => void
  setTag: (slug: string, tagId: string, value: boolean) => void
  setTagsForSlug: (slug: string, tagIds: string[]) => void
  createTag: (name: string) => UserTag
  deleteTag: (tagId: string) => void
}

const SolutionTagsContext = createContext<SolutionTagsContextValue | null>(null)

export function SolutionTagsProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    subscribeToTags,
    readTagState,
    getServerTagState,
  )

  const tags = useMemo(() => listTags(state), [state])
  const assignments = state.assignments
  const counts = useMemo(() => countTagAssignments(state), [state])

  const getTagIds = useCallback(
    (slug: string) => getTagsForSlug(slug, state),
    [state],
  )

  const hasTagForSlug = useCallback(
    (slug: string, tagId: string) =>
      hasTag(state.assignments, slug, tagId),
    [state],
  )

  const toggleTagForSlug = useCallback((slug: string, tagId: string) => {
    const before = hasTag(readTagState().assignments, slug, tagId)
    toggleTag(slug, tagId)
    const after = !before
    if (tagId === "revisit" && after) {
      void scheduleRevisit(slug)
    }
  }, [])

  const setTagForSlug = useCallback(
    (slug: string, tagId: string, value: boolean) => {
      setTag(slug, tagId, value)
      if (tagId === "revisit" && value) {
        void scheduleRevisit(slug)
      }
    },
    [],
  )

  const setTags = useCallback((slug: string, tagIds: string[]) => {
    setTagsForSlug(slug, tagIds)
    if (tagIds.includes("revisit")) {
      void scheduleRevisit(slug)
    }
  }, [])

  const createUserTag = useCallback((name: string) => createTag(name), [])
  const removeTag = useCallback((tagId: string) => deleteTag(tagId), [])

  const value = useMemo(
    () => ({
      tags,
      assignments,
      counts,
      getTagIds,
      hasTag: hasTagForSlug,
      toggleTag: toggleTagForSlug,
      setTag: setTagForSlug,
      setTagsForSlug: setTags,
      createTag: createUserTag,
      deleteTag: removeTag,
    }),
    [
      tags,
      assignments,
      counts,
      getTagIds,
      hasTagForSlug,
      toggleTagForSlug,
      setTagForSlug,
      setTags,
      createUserTag,
      removeTag,
    ],
  )

  return (
    <SolutionTagsContext.Provider value={value}>
      {children}
    </SolutionTagsContext.Provider>
  )
}

export function useSolutionTags() {
  const context = useContext(SolutionTagsContext)
  if (!context) {
    throw new Error(
      "useSolutionTags must be used within SolutionTagsProvider",
    )
  }
  return context
}
