"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { buildListHref, type ListHrefParams } from "@/lib/content/filter-solutions"
import {
  PREP_PACK_VALUES,
  prepPackLabel,
  type PrepPack,
} from "@/lib/content/prep-packs"
import { cn } from "@/lib/utils"

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
  const allHref = buildListHref(basePath, { ...hrefParams, prep: null })

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">Prep pack</span>
      <ToggleGroup
        variant="outline"
        size="sm"
        value={prep ? [prep] : ["all"]}
        className="flex-wrap"
      >
        <ToggleGroupItem
          value="all"
          nativeButton={false}
          render={<Link href={allHref} />}
          aria-label="All problems"
        >
          All
        </ToggleGroupItem>
        {PREP_PACK_VALUES.map((pack) => (
          <ToggleGroupItem
            key={pack}
            value={pack}
            nativeButton={false}
            render={
              <Link
                href={buildListHref(basePath, { ...hrefParams, prep: pack })}
              />
            }
            aria-label={prepPackLabel(pack)}
          >
            {prepPackLabel(pack)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {prep ? (
        <Badge variant="secondary">{prepPackLabel(prep)}</Badge>
      ) : null}
    </div>
  )
}
