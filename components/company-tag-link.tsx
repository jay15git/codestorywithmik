import Link from "next/link"

import { CompanyIcon, hasCompanyIcon } from "@/components/company-icon"
import { companySlug } from "@/lib/content/slug"
import { cn } from "@/lib/utils"

interface CompanyTagLinkProps {
  company: string
  className?: string
  iconSize?: number
}

function CompanyMark({
  company,
  size,
}: {
  company: string
  size: number
}) {
  if (hasCompanyIcon(company)) {
    return (
      <CompanyIcon company={company} size={size} className="size-4 shrink-0" />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="flex size-4 shrink-0 items-center justify-center text-[9px] font-semibold uppercase"
    >
      {company.charAt(0)}
    </span>
  )
}

export function sortCompanyTags(companies: string[]): string[] {
  return [...companies].sort((a, b) => {
    const aHasIcon = hasCompanyIcon(a) ? 0 : 1
    const bHasIcon = hasCompanyIcon(b) ? 0 : 1

    if (aHasIcon !== bHasIcon) {
      return aHasIcon - bHasIcon
    }

    return a.localeCompare(b)
  })
}

export function CompanyTagLink({
  company,
  className,
  iconSize = 16,
}: CompanyTagLinkProps) {
  return (
    <Link
      href={`/companies/${companySlug(company)}`}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <CompanyMark company={company} size={iconSize} />
      <span>{company}</span>
    </Link>
  )
}
