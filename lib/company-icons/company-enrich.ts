const LOGO_API_BASE = "https://api.companyenrich.com/logo"

export function getCompanyEnrichLogoUrl(domain: string): string {
  return `${LOGO_API_BASE}/${encodeURIComponent(domain)}`
}

export function getCompanyLogoUrl(domain: string): string {
  return getCompanyEnrichLogoUrl(domain)
}
