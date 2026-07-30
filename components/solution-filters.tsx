"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  buildListHref,
  DIFFICULTY_VALUES,
  formatMultiLabel,
  type ListFilterState,
  type ListSort,
} from "@/lib/content/filter-solutions"
import type { StatusFilterValue } from "@/lib/progress/filters"
import { cn } from "@/lib/utils"

const SORT_OPTIONS: Array<{ label: string; value: ListSort }> = [
  { label: "LeetCode id", value: "id" },
  { label: "Title", value: "title" },
  { label: "Difficulty", value: "difficulty" },
]

const STATUS_OPTIONS: Array<{ label: string; value: StatusFilterValue }> = [
  { label: "Unsolved", value: "unsolved" },
  { label: "Solved", value: "solved" },
  { label: "Starred", value: "starred" },
  { label: "Revisit", value: "revisit" },
]

function sameStringList(left: string[], right: string[]) {
  if (left.length !== right.length) return false
  const rightSet = new Set(right)
  return left.every((value) => rightSet.has(value))
}

function FilterSelect({
  label,
  emptyLabel,
  values,
  options,
  onCommit,
  className,
  menuClassName,
  multiple = true,
}: {
  label: string
  emptyLabel: string
  values: string[]
  options: Array<{ label: string; value: string }>
  onCommit: (next: string[]) => void
  className?: string
  menuClassName?: string
  multiple?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(values)
  const draftRef = useRef(draft)
  draftRef.current = draft

  useEffect(() => {
    if (!open) {
      setDraft(values)
    }
  }, [values, open])

  const labelMap = useMemo(
    () => new Map(options.map((option) => [option.value, option.label])),
    [options],
  )

  return (
    <Select
      multiple={multiple}
      value={multiple ? draft : (draft[0] ?? "")}
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          const committed = multiple
            ? draftRef.current
            : draftRef.current[0]
              ? [draftRef.current[0]]
              : []
          if (!sameStringList(committed, values)) {
            onCommit(committed)
          }
        }
        setOpen(next)
      }}
      onValueChange={(next) => {
        if (multiple) {
          setDraft(Array.isArray(next) ? next : [])
          return
        }
        setDraft(typeof next === "string" && next ? [next] : [])
      }}
    >
      <SelectTrigger className={cn("min-w-40", className)}>
        {(selected) => {
          const selectedValues = Array.isArray(selected)
            ? selected
            : selected
              ? [selected]
              : []
          return (
            <>
              <span className="text-muted-foreground">{label}: </span>
              {formatMultiLabel(selectedValues, emptyLabel, labelMap)}
            </>
          )
        }}
      </SelectTrigger>
      <SelectContent className={cn("max-h-80", menuClassName)}>
        {options.map((option, index) => (
          <SelectItem key={option.value} value={option.value} index={index}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function SolutionFilters({
  basePath,
  filters,
  companies,
  topics,
  currentTopicSlug,
  showStatus = true,
  showSort = false,
}: {
  basePath: string
  filters: Pick<
    ListFilterState,
    | "difficulties"
    | "companySlugs"
    | "topicSlugs"
    | "prep"
    | "statuses"
    | "sort"
  >
  companies?: Array<{ slug: string; name: string }>
  topics?: Array<{ slug: string; name: string }>
  currentTopicSlug?: string
  showStatus?: boolean
  showSort?: boolean
}) {
  const router = useRouter()

  const hasActiveFilters = Boolean(
    filters.difficulties.length > 0 ||
      filters.companySlugs.length > 0 ||
      filters.topicSlugs.length > 0 ||
      filters.prep ||
      filters.statuses.length > 0 ||
      (showSort && filters.sort && filters.sort !== "id"),
  )

  const shared = {
    difficulties: filters.difficulties,
    companySlugs: filters.companySlugs,
    topicSlugs: filters.topicSlugs,
    prep: filters.prep,
    statuses: filters.statuses,
    sort: filters.sort,
  }

  const pushFilters = (next: Partial<typeof shared>) => {
    router.push(buildListHref(basePath, { ...shared, ...next }))
  }

  const topicOptions =
    topics?.map((topic) => ({
      label: topic.name,
      value: topic.slug,
    })) ?? []

  const companyOptions =
    companies?.map((company) => ({
      label: company.name,
      value: company.slug,
    })) ?? []

  const difficultyOptions = DIFFICULTY_VALUES.map((value) => ({
    label: value,
    value,
  }))

  const statusOptions = STATUS_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }))

  return (
    <div className="flex flex-wrap items-center gap-2">
      {topics && topics.length > 0 ? (
        <FilterSelect
          label={currentTopicSlug ? "Related" : "Topic"}
          emptyLabel={currentTopicSlug ? "All" : "All topics"}
          values={filters.topicSlugs}
          options={topicOptions}
          className="min-w-48"
          onCommit={(topicSlugs) => pushFilters({ topicSlugs })}
        />
      ) : null}

      <FilterSelect
        label="Difficulty"
        emptyLabel="All"
        values={filters.difficulties}
        options={difficultyOptions}
        onCommit={(difficulties) =>
          pushFilters({ difficulties: difficulties as typeof filters.difficulties })
        }
      />

      {companies && companies.length > 0 ? (
        <FilterSelect
          label="Company"
          emptyLabel="All companies"
          values={filters.companySlugs}
          options={companyOptions}
          className="min-w-48"
          onCommit={(companySlugs) => pushFilters({ companySlugs })}
        />
      ) : null}

      {showSort ? (
        <FilterSelect
          label="Sort"
          emptyLabel="LeetCode id"
          values={[filters.sort ?? "id"]}
          options={SORT_OPTIONS}
          multiple={false}
          onCommit={(next) =>
            pushFilters({ sort: (next[0] as ListSort | undefined) ?? "id" })
          }
        />
      ) : null}

      {showStatus ? (
        <FilterSelect
          label="Progress"
          emptyLabel="All"
          values={filters.statuses}
          options={statusOptions}
          onCommit={(statuses) =>
            pushFilters({
              statuses: statuses as StatusFilterValue[],
            })
          }
        />
      ) : null}

      {hasActiveFilters ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          nativeButton={false}
          render={<Link href={basePath} />}
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  )
}
