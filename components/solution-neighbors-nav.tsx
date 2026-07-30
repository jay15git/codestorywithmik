"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  buildSolutionHref,
  type SolutionNavHrefParams,
} from "@/lib/content/solution-nav"
import { matchesStatusFilter } from "@/lib/progress/store"
import type { StatusFilter } from "@/lib/progress/types"
import { cn } from "@/lib/utils"

export type NeighborItem = {
  slug: string
  title: string
}

function findNeighborItems(
  solutions: NeighborItem[],
  currentSlug: string,
): { prev: NeighborItem | null; next: NeighborItem | null } {
  const index = solutions.findIndex((solution) => solution.slug === currentSlug)
  if (index === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: index > 0 ? solutions[index - 1] : null,
    next: index < solutions.length - 1 ? solutions[index + 1] : null,
  }
}

export function SolutionNeighborsNav({
  solutions,
  currentSlug,
  status = "all",
  navParams,
}: {
  solutions: NeighborItem[]
  currentSlug: string
  status?: StatusFilter
  navParams: SolutionNavHrefParams | null
}) {
  const router = useRouter()
  const { map } = useSolutionProgress()

  const ordered = useMemo(() => {
    if (status === "all") {
      return solutions
    }

    return solutions.filter((solution) =>
      matchesStatusFilter(map, solution.slug, status),
    )
  }, [solutions, status, map])

  const { prev, next } = useMemo(
    () => findNeighborItems(ordered, currentSlug),
    [ordered, currentSlug],
  )

  const hrefFor = (slug: string) =>
    navParams
      ? buildSolutionHref(slug, navParams)
      : `/solutions/${slug}`

  const prevHref = prev ? hrefFor(prev.slug) : null
  const nextHref = next ? hrefFor(next.slug) : null

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return
      }

      if (event.key === "ArrowLeft" && prevHref) {
        event.preventDefault()
        router.push(prevHref)
      }

      if (event.key === "ArrowRight" && nextHref) {
        event.preventDefault()
        router.push(nextHref)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [prevHref, nextHref, router])

  if (!prev && !next) {
    return null
  }

  return (
    <nav
      aria-label="Adjacent problems"
      className="flex items-stretch justify-between gap-3"
    >
      {prev ? (
        <Link
          href={hrefFor(prev.slug)}
          data-cuelume-press=""
          data-cuelume-release=""
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-auto max-w-[50%] flex-col items-start gap-0.5 px-3 py-2 whitespace-normal",
          )}
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronLeftIcon className="size-3.5" />
            Previous
          </span>
          <span className="line-clamp-1 text-left text-sm font-medium">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={hrefFor(next.slug)}
          data-cuelume-press=""
          data-cuelume-release=""
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-auto max-w-[50%] flex-col items-end gap-0.5 px-3 py-2 whitespace-normal",
          )}
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next
            <ChevronRightIcon className="size-3.5" />
          </span>
          <span className="line-clamp-1 text-right text-sm font-medium">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  )
}
