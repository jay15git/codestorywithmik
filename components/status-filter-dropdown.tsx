"use client"

import { useRouter } from "next/navigation"

import { FilterSelect } from "@/components/filter-select"
import { buildListHref, type ListHrefParams } from "@/lib/content/filter-solutions"
import type { StatusFilter } from "@/lib/progress/types"

const STATUS_OPTIONS: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Unsolved", value: "unsolved" },
  { label: "Solved", value: "solved" },
]

export function StatusFilterDropdown({
  basePath,
  status,
  hrefParams = {},
}: {
  basePath: string
  status: StatusFilter
  hrefParams?: Omit<ListHrefParams, "status" | "page" | "statuses">
}) {
  const router = useRouter()

  return (
    <FilterSelect
      label="Progress"
      emptyLabel="All"
      values={[status]}
      options={STATUS_OPTIONS}
      multiple={false}
      onCommit={(next) => {
        const value = (next[0] as StatusFilter | undefined) ?? "all"
        router.push(
          buildListHref(basePath, {
            ...hrefParams,
            status: value,
          }),
        )
      }}
    />
  )
}
