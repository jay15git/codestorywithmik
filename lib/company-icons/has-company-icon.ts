import { companySlug } from "@/lib/content/slug"
import {
  resolveCompanyDomain,
  resolveCompanyDomainBySlug,
} from "@/lib/company-icons/resolve-domain"

export function hasCompanyIcon(company: string): boolean {
  return (
    resolveCompanyDomain(company) ??
      resolveCompanyDomainBySlug(companySlug(company))
  ) !== null
}
