export function sortCompanyTags(companies: string[]): string[] {
  return [...companies].sort((a, b) => a.localeCompare(b))
}
