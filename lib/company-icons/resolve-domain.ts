import { COMPANY_DOMAINS } from "./domains"

export function companyBaseName(tag: string): string {
  return tag.split(/[,(]/)[0]?.trim() ?? tag
}

function lookupDomain(name: string): string | null {
  const key = name.toLowerCase().trim()
  if (!key) {
    return null
  }

  if (COMPANY_DOMAINS[key]) {
    return COMPANY_DOMAINS[key]
  }

  const compact = key.replace(/[^a-z0-9]/g, "")
  for (const [domainKey, domain] of Object.entries(COMPANY_DOMAINS)) {
    if (domainKey.replace(/[^a-z0-9]/g, "") === compact) {
      return domain
    }
  }

  if (compact.length >= 3 && /[a-z]/.test(compact)) {
    return `${compact}.com`
  }

  return null
}

export function resolveCompanyDomain(tag: string): string | null {
  return lookupDomain(companyBaseName(tag))
}

export function resolveCompanyDomainBySlug(slug: string): string | null {
  const normalizedSlug = slug.toLowerCase().replace(/-/g, " ")
  return lookupDomain(normalizedSlug)
}
