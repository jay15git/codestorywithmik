"use client"

import Link from "next/link"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buildListHref, type ListHrefParams } from "@/lib/content/filter-solutions"
import type { StatusFilter } from "@/lib/progress/types"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS: Array<{ label: string; value: StatusFilter }> = [
  { label: "All progress", value: "all" },
  { label: "Unsolved", value: "unsolved" },
  { label: "Solved", value: "solved" },
  { label: "Starred", value: "starred" },
  { label: "Revisit", value: "revisit" },
]

export function StatusFilterDropdown({
  basePath,
  status,
  hrefParams = {},
}: {
  basePath: string
  status: StatusFilter
  hrefParams?: Omit<ListHrefParams, "status" | "page">
}) {
  const selected =
    STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    "All progress"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="min-w-40 justify-between" />
        }
      >
        <span className="truncate">
          <span className="text-muted-foreground">Progress: </span>
          {selected.replace(/^All progress$/, "All")}
        </span>
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-64 w-56">
        {STATUS_OPTIONS.map((option) => {
          const href = buildListHref(basePath, {
            ...hrefParams,
            status: option.value,
          })
          const isActive = status === option.value

          return (
            <DropdownMenuItem
              key={option.value}
              render={<Link href={href} />}
              className={cn(isActive && "bg-accent")}
            >
              <span className="flex-1 truncate">{option.label}</span>
              {isActive ? <CheckIcon /> : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
