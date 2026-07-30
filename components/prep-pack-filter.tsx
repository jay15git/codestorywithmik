"use client"

import { useRouter } from "next/navigation"

import { FilterSelect } from "@/components/filter-select"
import { buildListHref, type ListHrefParams } from "@/lib/content/filter-solutions"
import {
  PREP_PACK_VALUES,
  prepPackLabel,
  type PrepPack,
} from "@/lib/content/prep-packs"
import { cn } from "@/lib/utils"

const PREP_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "All", value: "all" },
  ...PREP_PACK_VALUES.map((pack) => ({
    label: prepPackLabel(pack),
    value: pack,
  })),
]

export function PrepPackFilter({
  basePath,
  prep,
  hrefParams = {},
  className,
}: {
  basePath: string
  prep: PrepPack | null
  hrefParams?: Omit<ListHrefParams, "prep" | "page">
  className?: string
}) {
  const router = useRouter()

  return (
    <div className={cn(className)}>
      <FilterSelect
        label="Prep pack"
        emptyLabel="All"
        values={[prep ?? "all"]}
        options={PREP_OPTIONS}
        multiple={false}
        onCommit={(next) => {
          const value = next[0] ?? "all"
          router.push(
            buildListHref(basePath, {
              ...hrefParams,
              prep: value === "all" ? null : (value as PrepPack),
            }),
          )
        }}
      />
    </div>
  )
}
