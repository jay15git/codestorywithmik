import { hasCompanyIcon } from "@/lib/company-icons/has-company-icon"

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
