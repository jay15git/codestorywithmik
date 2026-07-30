import type { Metadata } from "next"
import Link from "next/link"

import { TitleUnderline } from "@/components/title-underline"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSolutions } from "@/lib/content/get-content"
import {
  getPatterns,
  getSolutionsForPattern,
} from "@/lib/content/patterns"

export const metadata: Metadata = {
  title: "Patterns — Interview Solutions",
  description:
    "Study LeetCode solutions by interview pattern: two pointers, DP, BFS/DFS, and more.",
}

export default function PatternsPage() {
  const solutions = getSolutions()
  const patterns = getPatterns().map((pattern) => ({
    pattern,
    count: getSolutionsForPattern(pattern, solutions).length,
  }))

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Patterns</h1>
        <p className="max-w-2xl text-muted-foreground">
          Curated interview patterns mapped onto LeetCode topic tags. Problems
          ordered Easy → Hard so you can ramp up within a pattern.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map(({ pattern, count }) => (
          <Link key={pattern.slug} href={`/patterns/${pattern.slug}`}>
            <Card className="h-full bg-card transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-base">
                  <TitleUnderline>{pattern.name}</TitleUnderline>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {pattern.description}
                </CardDescription>
                <p className="pt-1 text-xs tabular-nums text-muted-foreground">
                  {count} problems
                </p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
