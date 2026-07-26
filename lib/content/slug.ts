export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.cpp$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function slugifyParts(...parts: string[]): string {
  return slugify(parts.filter(Boolean).join("-"))
}

export function companySlug(company: string): string {
  return slugify(company)
}

export function topicSlugFromName(name: string): string {
  return slugify(name)
}
