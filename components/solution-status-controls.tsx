"use client"

import {
  CheckIcon,
  RotateCcwIcon,
  StarIcon,
} from "lucide-react"

import { SolutionSaveTagsDialog } from "@/components/solution-save-tags-dialog"
import { useSolutionProgress } from "@/components/solution-progress-provider"
import { useSolutionTags } from "@/components/solution-tags-provider"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { REVISIT_TAG_ID, STARRED_TAG_ID } from "@/lib/tags/constants"
import { cn } from "@/lib/utils"

export function SolutionStatusControls({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { hasFlag, toggleFlag } = useSolutionProgress()

  const solved = hasFlag(slug, "solved")

  return (
    <TooltipProvider>
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant={solved ? "default" : "outline"}
                size="sm"
                aria-pressed={solved}
                aria-label={
                  solved ? "Unset solved" : "Mark as solved"
                }
                onClick={() => toggleFlag(slug, "solved")}
              />
            }
          >
            <CheckIcon data-icon="inline-start" />
            Solved
          </TooltipTrigger>
          <TooltipContent>
            {solved ? "Remove solved" : "Mark as solved"}
          </TooltipContent>
        </Tooltip>
        <SolutionSaveTagsDialog slug={slug} />
      </div>
    </TooltipProvider>
  )
}

export function SolutionStatusMarkers({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { hasFlag } = useSolutionProgress()
  const { tags, getTagIds } = useSolutionTags()

  const solved = hasFlag(slug, "solved")
  const assignedIds = getTagIds(slug)
  const assignedTags = tags.filter((tag) => assignedIds.includes(tag.id))

  if (!solved && assignedTags.length === 0) {
    return null
  }

  return (
    <div
      className={cn("flex items-center gap-1 text-muted-foreground", className)}
      aria-label={[
        solved ? "Solved" : null,
        ...assignedTags.map((tag) => tag.name),
      ]
        .filter(Boolean)
        .join(", ")}
    >
      {solved ? (
        <CheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
      ) : null}
      {assignedTags.map((tag) => {
        if (tag.id === STARRED_TAG_ID) {
          return (
            <StarIcon
              key={tag.id}
              className="size-3.5 text-amber-600 dark:text-amber-400"
            />
          )
        }
        if (tag.id === REVISIT_TAG_ID) {
          return <RotateCcwIcon key={tag.id} className="size-3.5" />
        }
        return (
          <Badge
            key={tag.id}
            variant="secondary"
            className="h-5 px-1.5 text-[10px] font-normal"
          >
            {tag.name}
          </Badge>
        )
      })}
    </div>
  )
}
