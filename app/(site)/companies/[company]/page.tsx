import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CompanyIcon } from "@/components/company-icon"
import { SolutionView } from "@/components/solution-view-list"
import {
  SolutionViewProvider,
  SolutionViewToggle,
} from "@/components/solution-view"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  getCompanies,
  getCompanyName,
  getSolutionsByCompany,
} from "@/lib/content/get-content"
import { slugify } from "@/lib/content/slug"

interface CompanyPageProps {
  params: Promise<{ company: string }>
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

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { company: companySlug } = await params
  const company = getCompanyName(companySlug)

  if (!company) {
    notFound()
  }

  const solutions = getSolutionsByCompany(companySlug)

  return (
    <SolutionViewProvider>
      <div className="space-y-8">
          <div className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{company}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
                  <CompanyIcon company={company} className="size-8" size={32} />
                  {company}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {solutions.length} solutions tagged with this company
                </p>
              </div>
              <SolutionViewToggle />
            </div>
          </div>

          <div className="solution-list-section">
            <SolutionView solutions={solutions} />
          </div>
      </div>
    </SolutionViewProvider>
  )
}
