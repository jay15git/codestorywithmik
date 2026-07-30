"use client"

import Link from "next/link"

import { useSolutionTags } from "@/components/solution-tags-provider"
import { TitleUnderline } from "@/components/title-underline"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ALL_SAVED_LIST_ID,
  countSlugsForTagId,
  getListDescription,
} from "@/lib/tags/lists"

export function MyListsOverview() {
  const { tags, assignments } = useSolutionTags()

  const allSavedCount = countSlugsForTagId(assignments, ALL_SAVED_LIST_ID)

  const listCards = [
    {
      id: ALL_SAVED_LIST_ID,
      name: "All saved",
      description: getListDescription(ALL_SAVED_LIST_ID, null),
      count: allSavedCount,
    },
    ...tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      description: getListDescription(tag.id, tag),
      count: countSlugsForTagId(assignments, tag.id),
    })),
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {listCards.map((list) => (
        <Link key={list.id} href={`/lists/${list.id}`}>
          <Card className="h-full bg-card transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base">
                <TitleUnderline>{list.name}</TitleUnderline>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {list.description}
              </CardDescription>
              <p className="pt-1 text-xs tabular-nums text-muted-foreground">
                {list.count} problem{list.count === 1 ? "" : "s"}
              </p>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
