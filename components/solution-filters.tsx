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
import {
  buildListHref,
  DIFFICULTY_VALUES,
  type ListFilterState,
} from "@/lib/content/filter-solutions"
import type { Difficulty } from "@/lib/content/types"
import { cn } from "@/lib/utils"

const DIFFICULTY_OPTIONS: Array<{ label: string; value: Difficulty | null }> = [
  { label: "All difficulties", value: null },
  ...DIFFICULTY_VALUES.map((value) => ({ label: value, value })),
]

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
            key={option.href}
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
}: {
  basePath: string
  filters: Pick<ListFilterState, "difficulty" | "companySlug">
  companies?: Array<{ slug: string; name: string }>
  topics?: Array<{ slug: string; name: string }>
  currentTopicSlug?: string
}) {
  const hasActiveFilters = Boolean(filters.difficulty || filters.companySlug)
  const selectedCompany =
    companies?.find((company) => company.slug === filters.companySlug)?.name ??
    "All companies"
  const selectedTopic =
    topics?.find((topic) => topic.slug === currentTopicSlug)?.name ?? "Category"

  const topicOptions = topics
    ? topics.map((topic) => ({
        label: topic.name,
        href: buildListHref(`/topics/${topic.slug}`, {
          difficulty: filters.difficulty,
          companySlug: filters.companySlug,
        }),
        isActive: topic.slug === currentTopicSlug,
      }))
    : []

  const difficultyOptions = DIFFICULTY_OPTIONS.map((option) => ({
    label: option.label,
    href: buildListHref(basePath, {
      difficulty: option.value,
      companySlug: filters.companySlug,
    }),
    isActive: filters.difficulty === option.value,
  }))

  const companyOptions = companies
    ? [
        {
          label: "All companies",
          href: buildListHref(basePath, {
            difficulty: filters.difficulty,
            companySlug: null,
          }),
          isActive: !filters.companySlug,
        },
        ...companies.map((company) => ({
          label: company.name,
          href: buildListHref(basePath, {
            difficulty: filters.difficulty,
            companySlug: company.slug,
          }),
          isActive: filters.companySlug === company.slug,
        })),
      ]
    : []

  return (
    <div className="flex flex-wrap items-center gap-2">
      {topics && topics.length > 0 ? (
        <FilterDropdown
          label="Category"
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
