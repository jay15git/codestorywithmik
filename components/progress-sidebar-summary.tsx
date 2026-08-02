"use client"

import { CheckIcon, StarIcon } from "lucide-react"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import { useSolutionTags } from "@/components/solution-tags-provider"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function ProgressSidebarSummary({
  totalSolutions,
  className,
}: {
  totalSolutions: number
  className?: string
}) {
  const { counts } = useSolutionProgress()
  const { counts: tagCounts } = useSolutionTags()
  const percent =
    totalSolutions > 0
      ? Math.min(100, Math.round((counts.solved / totalSolutions) * 100))
      : 0

  return (
    <div className={cn("flex flex-col gap-3 px-2", className)}>
      <Separator />
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            My progress
          </p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {counts.solved}/{totalSolutions}
          </p>
        </div>
        <Progress value={percent} className="w-full" />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="tabular-nums">{counts.solved}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <StarIcon className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span className="tabular-nums">{tagCounts.starred}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
