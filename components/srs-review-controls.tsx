"use client"

import { useMemo, useSyncExternalStore } from "react"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import { Button } from "@/components/ui/button"
import {
  isDueOnOrBefore,
  previewSrsRatings,
  toUtcDateKey,
} from "@/lib/srs/schedule"
import {
  getServerSrsMap,
  getSrsCard,
  markDueToday,
  rateSrsCard,
  readSrsMap,
  subscribeToSrs,
} from "@/lib/srs/store"
import type { SrsRating } from "@/lib/srs/types"
import { REVISIT_TAG_ID } from "@/lib/tags/constants"
import { hasTag } from "@/lib/tags/filters"
import {
  getServerTagState,
  readTagState,
  setTag,
  subscribeToTags,
} from "@/lib/tags/store"

const RATINGS: Array<{ rating: SrsRating; label: string }> = [
  { rating: "again", label: "Again" },
  { rating: "hard", label: "Hard" },
  { rating: "good", label: "Good" },
  { rating: "easy", label: "Easy" },
]

function formatReviewDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-")
  const monthName = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))))

  return `${day} ${monthName} '${year.slice(-2)}`
}

export function SrsReviewControls({ slug }: { slug: string }) {
  const { setFlag } = useSolutionProgress()
  const srsMap = useSyncExternalStore(
    subscribeToSrs,
    readSrsMap,
    getServerSrsMap,
  )
  const tagState = useSyncExternalStore(
    subscribeToTags,
    readTagState,
    getServerTagState,
  )
  const card = getSrsCard(srsMap, slug)
  const today = toUtcDateKey()
  const revisit = hasTag(tagState.assignments, slug, REVISIT_TAG_ID)
  const due =
    revisit || (card ? isDueOnOrBefore(card.dueAt, today) : false)
  const previews = useMemo(
    () => previewSrsRatings(card),
    [card],
  )

  function handleRate(rating: SrsRating) {
    rateSrsCard(slug, rating)
    if (rating === "again") {
      setTag(slug, REVISIT_TAG_ID, true)
      markDueToday(slug)
    } else {
      setFlag(slug, "solved", true)
    }
  }

  if (!card && !revisit) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {due ? (
        <>
          <span className="text-sm font-medium">Rate recall</span>
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
        </>
      ) : (
        <span className="text-sm text-muted-foreground">
          Next review {formatReviewDate(card!.dueAt)}
        </span>
      )}
    </div>
  )
}
