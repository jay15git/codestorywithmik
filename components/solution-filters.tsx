"use client"

import Link from "next/link"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { StatusFilterDropdown } from "@/components/status-filter-dropdown"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  buildListHref,
  DIFFICULTY_VALUES,
  type ListFilterState,
  type ListSort,
} from "@/lib/content/filter-solutions"
import {
  SOLUTION_LANGUAGE_LABELS,
  SOLUTION_LANGUAGE_ORDER,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"
import type { Difficulty } from "@/lib/content/types"
import { cn } from "@/lib/utils"

const DIFFICULTY_OPTIONS: Array<{ label: string; value: Difficulty | null }> = [
  { label: "All difficulties", value: null },
  ...DIFFICULTY_VALUES.map((value) => ({ label: value, value })),
]

const LANG_OPTIONS: Array<{
  label: string
  value: SolutionLanguage | null
}> = [
  { label: "Any language", value: null },
  ...SOLUTION_LANGUAGE_ORDER.map((value) => ({
    label: SOLUTION_LANGUAGE_LABELS[value],
    value,
  })),
]

const SORT_OPTIONS: Array<{ label: string; value: ListSort }> = [
  { label: "LeetCode id", value: "id" },
  { label: "Title", value: "title" },
  { label: "Difficulty", value: "difficulty" },
]

const SORT_LABELS: Record<ListSort, string> = {
  id: "LeetCode id",
  title: "Title",
  difficulty: "Difficulty",
}

function FilterDropdown({
  label,
  value,
  options,
  className,
  menuClassName,
}: {
  label: string
  value: string
  options: Array<{ label: string; href: string; isActive: boolean }>
  className?: string
  menuClassName?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("min-w-40 justify-between", className)}
          />
        }
      >
        <span className="truncate">
          <span className="text-muted-foreground">{label}: </span>
          {value}
        </span>
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn("max-h-64 w-56", menuClassName)}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.href + option.label}
            render={<Link href={option.href} />}
            className={cn(option.isActive && "bg-accent")}
          >
            <span className="flex-1 truncate">{option.label}</span>
            {option.isActive ? <CheckIcon /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SolutionFilters({
  basePath,
  filters,
  companies,
  topics,
  currentTopicSlug,
  showStatus = true,
  showLanguage = true,
  showSort = false,
}: {
  basePath: string
  filters: Pick<
    ListFilterState,
    | "difficulty"
    | "companySlug"
    | "topicSlug"
    | "prep"
    | "status"
    | "lang"
    | "sort"
  >
  companies?: Array<{ slug: string; name: string }>
  topics?: Array<{ slug: string; name: string }>
  currentTopicSlug?: string
  showStatus?: boolean
  showLanguage?: boolean
  showSort?: boolean
}) {
  const hasActiveFilters = Boolean(
    filters.difficulty ||
      filters.companySlug ||
      filters.topicSlug ||
      filters.lang ||
      filters.prep ||
      (filters.status && filters.status !== "all") ||
      (showSort && filters.sort && filters.sort !== "id"),
  )
  const selectedCompany =
    companies?.find((company) => company.slug === filters.companySlug)?.name ??
    "All companies"
  const selectedTopic =
    topics?.find(
      (topic) => topic.slug === (currentTopicSlug ?? filters.topicSlug),
    )?.name ?? "All topics"

  const shared = {
    difficulty: filters.difficulty,
    companySlug: filters.companySlug,
    topicSlug: filters.topicSlug,
    prep: filters.prep,
    status: filters.status,
    lang: filters.lang,
    sort: filters.sort,
  }

  const topicOptions = topics
    ? [
        ...(currentTopicSlug
          ? []
          : [
              {
                label: "All topics",
                href: buildListHref(basePath, {
                  ...shared,
                  topicSlug: null,
                }),
                isActive: !filters.topicSlug,
              },
            ]),
        ...topics.map((topic) => ({
          label: topic.name,
          href: currentTopicSlug
            ? buildListHref(`/topics/${topic.slug}`, {
                difficulty: filters.difficulty,
                companySlug: filters.companySlug,
                status: filters.status,
                lang: filters.lang,
                sort: filters.sort,
              })
            : buildListHref(basePath, {
                ...shared,
                topicSlug: topic.slug,
              }),
          isActive:
            topic.slug === (currentTopicSlug ?? filters.topicSlug),
        })),
      ]
    : []

  const difficultyOptions = DIFFICULTY_OPTIONS.map((option) => ({
    label: option.label,
    href: buildListHref(basePath, {
      ...shared,
      difficulty: option.value,
    }),
    isActive: filters.difficulty === option.value,
  }))

  const companyOptions = companies
    ? [
        {
          label: "All companies",
          href: buildListHref(basePath, {
            ...shared,
            companySlug: null,
          }),
          isActive: !filters.companySlug,
        },
        ...companies.map((company) => ({
          label: company.name,
          href: buildListHref(basePath, {
            ...shared,
            companySlug: company.slug,
          }),
          isActive: filters.companySlug === company.slug,
        })),
      ]
    : []

  const languageOptions = LANG_OPTIONS.map((option) => ({
    label: option.label,
    href: buildListHref(basePath, {
      ...shared,
      lang: option.value,
    }),
    isActive: filters.lang === option.value,
  }))

  const sortOptions = SORT_OPTIONS.map((option) => ({
    label: option.label,
    href: buildListHref(basePath, {
      ...shared,
      sort: option.value,
    }),
    isActive: (filters.sort ?? "id") === option.value,
  }))

  return (
    <div className="flex flex-wrap items-center gap-2">
      {topics && topics.length > 0 ? (
        <FilterDropdown
          label={currentTopicSlug ? "Category" : "Topic"}
          value={selectedTopic}
          options={topicOptions}
          className="min-w-48"
          menuClassName="max-h-80"
        />
      ) : null}

      <FilterDropdown
        label="Difficulty"
        value={filters.difficulty ?? "All"}
        options={difficultyOptions}
      />

      {companies && companies.length > 0 ? (
        <FilterDropdown
          label="Company"
          value={selectedCompany}
          options={companyOptions}
          className="min-w-48"
        />
      ) : null}

      {showLanguage ? (
        <FilterDropdown
          label="Lang"
          value={
            filters.lang ? SOLUTION_LANGUAGE_LABELS[filters.lang] : "Any"
          }
          options={languageOptions}
        />
      ) : null}

      {showSort ? (
        <FilterDropdown
          label="Sort"
          value={SORT_LABELS[filters.sort ?? "id"]}
          options={sortOptions}
        />
      ) : null}

      {showStatus ? (
        <StatusFilterDropdown
          basePath={basePath}
          status={filters.status}
          hrefParams={{
            difficulty: filters.difficulty,
            companySlug: filters.companySlug,
            topicSlug: filters.topicSlug,
            prep: filters.prep,
            lang: filters.lang,
            sort: filters.sort,
          }}
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
