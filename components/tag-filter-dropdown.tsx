"use client"

import { useRouter } from "next/navigation"

import { FilterSelect } from "@/components/filter-select"
import { useSolutionTags } from "@/components/solution-tags-provider"
import {
  buildListHref,
  type ListHrefParams,
} from "@/lib/content/filter-solutions"

export function TagFilterDropdown({
  basePath,
  tagIds,
  hrefParams = {},
}: {
  basePath: string
  tagIds: string[]
  hrefParams?: Omit<ListHrefParams, "tagIds" | "page">
}) {
  const router = useRouter()
  const { tags } = useSolutionTags()

  const options = tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
  }))

  if (options.length === 0) {
    return null
  }

  return (
    <FilterSelect
      label="Tags"
      emptyLabel="All tags"
      values={tagIds}
      options={options}
      onCommit={(next) => {
        router.push(
          buildListHref(basePath, {
            ...hrefParams,
            tagIds: next,
          })
        )
      }}
    />
  )
}
