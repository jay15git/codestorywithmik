"use client"

import {
  CheckIcon,
  RotateCcwIcon,
  StarIcon,
} from "lucide-react"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ProgressFlag } from "@/lib/progress/types"
import { cn } from "@/lib/utils"

const CONTROLS: Array<{
  flag: ProgressFlag
  label: string
  Icon: typeof CheckIcon
}> = [
  { flag: "solved", label: "Solved", Icon: CheckIcon },
  { flag: "starred", label: "Starred", Icon: StarIcon },
  { flag: "revisit", label: "Revisit", Icon: RotateCcwIcon },
]

export function SolutionStatusControls({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { hasFlag, toggleFlag } = useSolutionProgress()

  return (
    <TooltipProvider>
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {CONTROLS.map(({ flag, label, Icon }) => {
          const active = hasFlag(slug, flag)
          return (
            <Tooltip key={flag}>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant={active ? "default" : "outline"}
                    size="sm"
                    aria-pressed={active}
                    aria-label={`${active ? "Unset" : "Mark"} ${label.toLowerCase()}`}
                    onClick={() => toggleFlag(slug, flag)}
                  />
                }
              >
                <Icon data-icon="inline-start" />
                {label}
              </TooltipTrigger>
              <TooltipContent>
                {active ? `Remove ${label.toLowerCase()}` : `Mark as ${label.toLowerCase()}`}
              </TooltipContent>
            </Tooltip>
          )
        })}
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
  const solved = hasFlag(slug, "solved")
  const starred = hasFlag(slug, "starred")
  const revisit = hasFlag(slug, "revisit")

  if (!solved && !starred && !revisit) {
    return null
  }

  return (
    <div
      className={cn("flex items-center gap-1 text-muted-foreground", className)}
      aria-label={[
        solved ? "Solved" : null,
        starred ? "Starred" : null,
        revisit ? "Revisit" : null,
      ]
        .filter(Boolean)
        .join(", ")}
    >
      {solved ? (
        <CheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
      ) : null}
      {starred ? (
        <StarIcon className="size-3.5 text-amber-600 dark:text-amber-400" />
      ) : null}
      {revisit ? <RotateCcwIcon className="size-3.5" /> : null}
    </div>
  )
}
