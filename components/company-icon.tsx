import Image from "next/image"

import { companySlug } from "@/lib/content/slug"
import { getCompanyLogoUrl } from "@/lib/company-icons/company-enrich"
import {
  resolveCompanyDomain,
  resolveCompanyDomainBySlug,
} from "@/lib/company-icons/resolve-domain"
import { cn } from "@/lib/utils"

interface CompanyIconProps {
  company: string
  className?: string
  size?: number
}

function getCompanyDomain(company: string): string | null {
  return (
    resolveCompanyDomain(company) ??
    resolveCompanyDomainBySlug(companySlug(company))
  )
}

export function CompanyIcon({
  company,
  className,
  size = 14,
}: CompanyIconProps) {
  const domain = getCompanyDomain(company)
  if (!domain) {
    return null
  }

  return (
    <Image
      src={getCompanyLogoUrl(domain)}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
    />
  )
}
