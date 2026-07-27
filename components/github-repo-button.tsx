import { Github01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "lucide-react"

import { ButtonLink } from "@/components/button-link"

const REPO_SLUG = "jay15git/codestorywithmik"
const REPO_URL = `https://github.com/${REPO_SLUG}`

async function getStarCount(): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_SLUG}`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as { stargazers_count?: number }
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null
  } catch {
    return null
  }
}

function formatStarCount(count: number): string {
  if (count >= 1000) {
    const value = count / 1000
    const rounded = value >= 10 ? value.toFixed(0) : value.toFixed(1)
    return `${rounded.replace(/\.0$/, "")}k`
  }

  return String(count)
}

export async function GithubRepoButton() {
  const stars = await getStarCount()

  return (
    <ButtonLink
      variant="ghost"
      size="sm"
      href={REPO_URL}
      external
      aria-label={
        stars != null
          ? `GitHub repository, ${stars} stars`
          : "GitHub repository"
      }
      className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
    >
      <HugeiconsIcon icon={Github01Icon} className="size-4" strokeWidth={1.5} />
      <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
      {stars != null ? (
        <span className="text-xs tabular-nums">{formatStarCount(stars)}</span>
      ) : null}
    </ButtonLink>
  )
}
