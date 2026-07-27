import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SolutionsPagination } from "@/components/solutions-pagination"
import { SolutionView } from "@/components/solution-view-list"
import {
  SolutionViewProvider,
  SolutionViewToggle,
} from "@/components/solution-view"
import {
  getCompanies,
  getCompanyName,
  getSolutionsByCompany,
} from "@/lib/content/get-content"
import { slugify } from "@/lib/content/slug"

const PAGE_SIZE = 48

interface CompanyPageProps {
  params: Promise<{ company: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  return getCompanies().map((company) => ({ company: slugify(company) }))
}

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { company: companySlug } = await params
  const company = getCompanyName(companySlug)

  if (!company) {
    return { title: "Company not found" }
  }

  return {
    title: `${company} interview questions`,
    description: `Solutions tagged with ${company} in coding interviews.`,
  }
}

export default async function CompanyPage({
  params,
  searchParams,
}: CompanyPageProps) {
  const { company: companySlug } = await params
  const { page: pageParam } = await searchParams
  const company = getCompanyName(companySlug)

  if (!company) {
    notFound()
  }

  const solutions = getSolutionsByCompany(companySlug)
  const totalPages = Math.max(1, Math.ceil(solutions.length / PAGE_SIZE))
  const page = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1),
  )
  const pageSolutions = solutions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )
  const basePath = `/companies/${companySlug}`

  return (
    <SolutionViewProvider>
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {company}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {solutions.length} solutions tagged with this company
              {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
            </p>
          </div>
          <SolutionViewToggle />
        </div>

        <div className="solution-list-section">
          <SolutionView solutions={pageSolutions} />
        </div>

        <SolutionsPagination
          basePath={basePath}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </SolutionViewProvider>
  )
}
