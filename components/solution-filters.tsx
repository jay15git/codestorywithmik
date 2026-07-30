"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { FilterSelect } from "@/components/filter-select"
import { useSolutionTags } from "@/components/solution-tags-provider"
import { Button } from "@/components/ui/button"
import {
  buildListHref,
  DIFFICULTY_VALUES,
  type ListFilterState,
  type ListSort,
} from "@/lib/content/filter-solutions"
import type { StatusFilterValue } from "@/lib/progress/filters"

const SORT_OPTIONS: Array<{ label: string; value: ListSort }> = [
  { label: "LeetCode id", value: "id" },
  { label: "Title", value: "title" },
  { label: "Difficulty", value: "difficulty" },
]

const STATUS_OPTIONS: Array<{ label: string; value: StatusFilterValue }> = [
  { label: "Unsolved", value: "unsolved" },
  { label: "Solved", value: "solved" },
]

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
    | "tagIds"
    | "sort"
  >
  companies?: Array<{ slug: string; name: string }>
  topics?: Array<{ slug: string; name: string }>
  currentTopicSlug?: string
  showStatus?: boolean
  showSort?: boolean
}) {
  const router = useRouter()
  const { tags } = useSolutionTags()

  const hasActiveFilters = Boolean(
    filters.difficulties.length > 0 ||
      filters.companySlugs.length > 0 ||
      filters.topicSlugs.length > 0 ||
      filters.prep ||
      filters.statuses.length > 0 ||
      filters.tagIds.length > 0 ||
      (showSort && filters.sort && filters.sort !== "id"),
  )

  const shared = {
    difficulties: filters.difficulties,
    companySlugs: filters.companySlugs,
    topicSlugs: filters.topicSlugs,
    prep: filters.prep,
    statuses: filters.statuses,
    tagIds: filters.tagIds,
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

  const tagOptions = tags.map((tag) => ({
    label: tag.name,
    value: tag.id,
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
          pushFilters({
            difficulties: difficulties as typeof filters.difficulties,
          })
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

      {showStatus && tagOptions.length > 0 ? (
        <FilterSelect
          label="Tags"
          emptyLabel="All tags"
          values={filters.tagIds}
          options={tagOptions}
          className="min-w-40"
          onCommit={(tagIds) => pushFilters({ tagIds })}
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
