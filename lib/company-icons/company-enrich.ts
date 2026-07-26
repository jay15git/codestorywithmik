const LOGO_API_BASE = "https://api.companyenrich.com/logo"

/** Domains where CompanyEnrich (or other APIs) serve stale/wrong marks. */
const DOMAIN_LOGO_OVERRIDES: Record<string, string> = {
  "x.com": "/company-logos/x.com.svg",
}

export function getCompanyEnrichLogoUrl(domain: string): string {
  return `${LOGO_API_BASE}/${encodeURIComponent(domain)}`
}

export function getCompanyLogoUrl(domain: string): string {
  return DOMAIN_LOGO_OVERRIDES[domain] ?? getCompanyEnrichLogoUrl(domain)
}
