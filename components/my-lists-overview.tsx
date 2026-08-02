"use client"

import Link from "next/link"

import { useSolutionTags } from "@/components/solution-tags-provider"
import { TitleUnderline } from "@/components/title-underline"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ALL_SAVED_LIST_ID } from "@/lib/tags/lists"

export function MyListsOverview() {
  const { tags } = useSolutionTags()

  const listCards = [
    {
      id: ALL_SAVED_LIST_ID,
      name: "All saved",
    },
    ...tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    })),
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {listCards.map((list) => (
        <Link
          key={list.id}
          href={`/lists/${list.id}`}
          data-cuelume-press=""
          data-cuelume-release=""
        >
          <Card className="h-full bg-card transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base">
                <TitleUnderline>{list.name}</TitleUnderline>
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
