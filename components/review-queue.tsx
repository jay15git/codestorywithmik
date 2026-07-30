"use client"

import { useMemo, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { DifficultyBadge } from "@/components/difficulty-badge"
import { useSolutionTags } from "@/components/solution-tags-provider"
import { TitleUnderline } from "@/components/title-underline"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { buttonVariants } from "@/components/ui/button-variants"
import type { Difficulty } from "@/lib/content/types"
import {
  buildReviewQueue,
  getServerSrsMap,
  readSrsMap,
  subscribeToSrs,
} from "@/lib/srs/store"
import { toUtcDateKey } from "@/lib/srs/dates"
import { cn } from "@/lib/utils"

export interface ReviewSolutionItem {
  slug: string
  title: string
  difficulty: Difficulty | null
  topic: string
}

export function ReviewQueue({
  solutions,
}: {
  solutions: ReviewSolutionItem[]
}) {
  const router = useRouter()
  const { assignments } = useSolutionTags()
  const srsMap = useSyncExternalStore(
    subscribeToSrs,
    readSrsMap,
    getServerSrsMap,
  )

  const bySlug = useMemo(() => {
    const map = new Map<string, ReviewSolutionItem>()
    for (const solution of solutions) {
      map.set(solution.slug, solution)
    }
    return map
  }, [solutions])

  const today = toUtcDateKey()
  const queue = useMemo(
    () => buildReviewQueue(srsMap, assignments, today),
    [srsMap, assignments, today],
  )

  const resolved = queue
    .map((item) => {
      const solution = bySlug.get(item.slug)
      if (!solution) return null
      return { ...item, solution }
    })
    .filter(
      (
        item,
      ): item is {
        slug: string
        dueAt: string
        source: "srs" | "revisit"
        solution: ReviewSolutionItem
      } => Boolean(item),
    )

  const upcoming = useMemo(() => {
    return Object.entries(srsMap)
      .filter(([, card]) => card.dueAt > today)
      .sort((left, right) => left[1].dueAt.localeCompare(right[1].dueAt))
      .slice(0, 8)
      .map(([slug, card]) => ({ slug, card, solution: bySlug.get(slug) }))
      .filter((item) => item.solution)
  }, [srsMap, today, bySlug])

  function openNext() {
    const next = resolved[0]
    if (!next) return
    router.push(`/solutions/${next.slug}`)
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Review queue
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Spaced repetition from local cards. Mark solved to enroll; rate
              recall on the solution page. Revisit flags also land here.
            </p>
            <p className="mt-2 text-sm tabular-nums text-muted-foreground">
              {today} UTC · {resolved.length} due
            </p>
          </div>
          <Button
            type="button"
            disabled={resolved.length === 0}
            onClick={openNext}
          >
            Study next
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Due now</h2>
        {resolved.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyTitle>Nothing due</EmptyTitle>
              <EmptyDescription>
                Solve a problem and it schedules for tomorrow. Or mark revisit
                to pull it into today&apos;s queue.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="divide-y rounded-lg border bg-card">
            {resolved.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/solutions/${item.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <DifficultyBadge difficulty={item.solution.difficulty} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    <TitleUnderline>{item.solution.title}</TitleUnderline>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.source === "revisit" ? "revisit" : item.dueAt}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {upcoming.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Coming up</h2>
          <ul className="divide-y rounded-lg border bg-card">
            {upcoming.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/solutions/${item.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <DifficultyBadge difficulty={item.solution!.difficulty} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    <TitleUnderline>{item.solution!.title}</TitleUnderline>
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {item.card.dueAt}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="flex flex-wrap gap-2">
        <Link
          href="/plans"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Study plans
        </Link>
        <Link
          href="/daily"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Daily set
        </Link>
      </p>
    </div>
  )
}
