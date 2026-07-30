"use client"

import { useMemo, useSyncExternalStore } from "react"
import Link from "next/link"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import { Button } from "@/components/ui/button"
import {
  getSrsStateLabel,
  isDueOnOrBefore,
  previewSrsRatings,
  toUtcDateKey,
} from "@/lib/srs/schedule"
import {
  getServerSrsMap,
  getSrsCard,
  rateSrsCard,
  readSrsMap,
  subscribeToSrs,
} from "@/lib/srs/store"
import type { SrsRating } from "@/lib/srs/types"

const RATINGS: Array<{ rating: SrsRating; label: string }> = [
  { rating: "again", label: "Again" },
  { rating: "hard", label: "Hard" },
  { rating: "good", label: "Good" },
  { rating: "easy", label: "Easy" },
]

export function SrsReviewControls({ slug }: { slug: string }) {
  const { hasFlag, setFlag } = useSolutionProgress()
  const srsMap = useSyncExternalStore(
    subscribeToSrs,
    readSrsMap,
    getServerSrsMap,
  )
  const card = getSrsCard(srsMap, slug)
  const today = toUtcDateKey()
  const revisit = hasFlag(slug, "revisit")
  const due =
    revisit || (card ? isDueOnOrBefore(card.dueAt, today) : false)
  const previews = useMemo(
    () => previewSrsRatings(card),
    [card],
  )

  function handleRate(rating: SrsRating) {
    rateSrsCard(slug, rating)
    if (rating === "again") {
      setFlag(slug, "revisit", true)
    } else {
      setFlag(slug, "solved", true)
    }
  }

  if (!card && !revisit) {
    return (
      <p className="text-sm text-muted-foreground">
        Mark solved to enroll in{" "}
        <Link href="/review" className="underline underline-offset-2">
          spaced review
        </Link>
        .
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card px-3 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium">
          {due ? "Rate recall" : "Next review"}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {card ? `due ${card.dueAt}` : "due today"}
          {card ? ` · ${getSrsStateLabel(card.state)}` : null}
        </p>
      </div>
      {due ? (
        <div className="flex flex-wrap gap-2">
          {RATINGS.map(({ rating, label }) => (
            <Button
              key={rating}
              type="button"
              size="sm"
              variant={rating === "again" ? "outline" : "secondary"}
              onClick={() => handleRate(rating)}
            >
              <span>{label}</span>
              <span className="ml-1.5 text-xs tabular-nums opacity-70">
                {previews[rating]}
              </span>
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Not due yet.{" "}
          <Link href="/review" className="underline underline-offset-2">
            Open queue
          </Link>
        </p>
      )}
    </div>
  )
}
