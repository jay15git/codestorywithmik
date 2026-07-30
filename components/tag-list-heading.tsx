"use client"

import { useSolutionTags } from "@/components/solution-tags-provider"
import { getListDescription, getListTitle } from "@/lib/tags/lists"

export function TagListHeading({ tagId }: { tagId: string }) {
  const { tags } = useSolutionTags()
  const tag = tags.find((item) => item.id === tagId) ?? null

  const title = getListTitle(tagId, tag)
  const description = getListDescription(tagId, tag)

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-2xl text-muted-foreground">{description}</p>
    </>
  )
}
