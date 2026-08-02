import type { Metadata } from "next"
import Link from "next/link"

import { DifficultyBadge } from "@/components/difficulty-badge"
import { RandomProblemButton } from "@/components/random-problem-button"
import { TitleUnderline } from "@/components/title-underline"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  getProblemOfTheDay,
  getWeeklySet,
  toDateKey,
  toWeekKey,
} from "@/lib/content/daily-set"
import { getSolutions } from "@/lib/content/get-content"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Daily & Weekly",
  description:
    "Problem of the day and weekly practice set. Same for everyone.",
}

export default function DailyPage() {
  const now = new Date()
  const solutions = getSolutions()
  const potd = getProblemOfTheDay(solutions, now)
  const weekly = getWeeklySet(solutions, now, 7)

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Daily & weekly
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Same problem of the day and weekly set for every visitor.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Problem of the day</h2>
            <p className="text-sm text-muted-foreground">{toDateKey(now)} UTC</p>
          </div>
          {potd ? (
            <RandomProblemButton
              slugs={[potd.slug]}
              unsolvedOnly={false}
              label="Open"
            />
          ) : null}
        </div>

        {potd ? (
          <Link
            href={`/solutions/${potd.slug}`}
            className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/40"
          >
            <DifficultyBadge difficulty={potd.difficulty} />
            <span className="min-w-0 flex-1 text-base font-medium">
              <TitleUnderline>{potd.title}</TitleUnderline>
            </span>
            <span className="text-xs text-muted-foreground">
              {potd.topicTags.slice(0, 2).join(" · ")}
            </span>
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">No solutions indexed.</p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">This week</h2>
            <p className="text-sm text-muted-foreground">
              {toWeekKey(now)} · 7 problems
            </p>
          </div>
          <RandomProblemButton solutions={weekly} label="Random from week" />
        </div>

        <ul className="divide-y rounded-lg border bg-card">
          {weekly.map((solution, index) => (
            <li key={solution.slug}>
              <Link
                href={`/solutions/${solution.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <span className="w-6 shrink-0 text-xs tabular-nums text-muted-foreground">
                  {index + 1}
                </span>
                <DifficultyBadge difficulty={solution.difficulty} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  <TitleUnderline>{solution.title}</TitleUnderline>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p>
        <Link
          href="/problems"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
          )}
        >
          All problems
        </Link>
      </p>
    </div>
  )
}
