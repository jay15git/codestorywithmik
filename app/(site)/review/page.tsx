import type { Metadata } from "next"

import { ReviewQueue } from "@/components/review-queue"
import { getSolutions } from "@/lib/content/get-content"

export const metadata: Metadata = {
  title: "Review — LeetSeek",
  description:
    "Spaced repetition queue for problems you have solved or marked to revisit.",
}

export default function ReviewPage() {
  const solutions = getSolutions().map((solution) => ({
    slug: solution.slug,
    title: solution.title,
    difficulty: solution.difficulty,
    topic: solution.topic,
  }))

  return <ReviewQueue solutions={solutions} />
}
