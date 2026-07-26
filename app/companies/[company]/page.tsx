import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { CompanyIcon } from "@/components/company-icon"
import { SolutionCard } from "@/components/solution-card"
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
    <AppShell>
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

          <div>
            <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
              <CompanyIcon company={company} className="size-8" size={32} />
              {company}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {solutions.length} solutions tagged with this company
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {solutions.map((solution) => (
            <SolutionCard key={solution.slug} solution={solution} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
