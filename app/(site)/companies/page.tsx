import type { Metadata } from "next"
import Link from "next/link"

import { TitleUnderline } from "@/components/title-underline"
import { PageHeader } from "@/components/page-header"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  buildCompanyList,
  parseCompanySort,
  sortCompanies,
} from "@/lib/content/company-list"
import { getCompanies, getSolutions } from "@/lib/content/get-content"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Companies",
  description:
    "Browse LeetCode solutions by company. Sort by name or interview frequency.",
}

interface CompaniesPageProps {
  searchParams: Promise<{ sort?: string }>
}

export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {
  const { sort: sortParam } = await searchParams
  const sort = parseCompanySort(sortParam)
  const companies = sortCompanies(
    buildCompanyList(getSolutions(), getCompanies()),
    sort,
  )

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Companies"
        description="Community interview tags, with frequency based on reported ask rates across problems."
        meta={`${companies.length} companies`}
      >
        <div className="flex flex-wrap gap-2">
          <Link
            href="/companies"
            className={cn(
              buttonVariants({
                variant: sort === "name" ? "default" : "outline",
                size: "sm",
              }),
            )}
          >
            A-Z
          </Link>
          <Link
            href="/companies?sort=frequency"
            className={cn(
              buttonVariants({
                variant: sort === "frequency" ? "default" : "outline",
                size: "sm",
              }),
            )}
          >
            Asked most
          </Link>
        </div>
      </PageHeader>

      <ul className="divide-y rounded-lg border bg-card">
        {companies.map((company, index) => (
          <li key={company.slug}>
            <Link
              href={`/companies/${company.slug}`}
              className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40"
            >
              {sort === "frequency" ? (
                <span className="w-8 shrink-0 text-xs tabular-nums text-muted-foreground">
                  {index + 1}
                </span>
              ) : null}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                <TitleUnderline>{company.name}</TitleUnderline>
              </span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {company.problemCount} problems
                {company.frequencyScore > 0
                  ? ` · freq ${Math.round(company.frequencyScore)}`
                  : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
