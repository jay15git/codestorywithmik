"use client"

import { CheckIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { SolutionSaveTagsDialog } from "@/components/solution-save-tags-dialog"
import { useSolutionProgress } from "@/components/solution-progress-provider"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const stateSwap = { duration: 0.15, ease: "easeOut" as const }
const stateSwapHidden = { opacity: 0, filter: "blur(2px)" }
const stateSwapVisible = { opacity: 1, filter: "blur(0px)" }

export function SolutionStatusControls({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { hasFlag, toggleFlag } = useSolutionProgress()

  const solved = hasFlag(slug, "solved")
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion ? { duration: 0 } : stateSwap

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
                className={cn(
                  "t-resize",
                  solved ? "w-[5.25rem]" : "w-[6.5rem]"
                )}
                aria-pressed={solved}
                aria-label={solved ? "Unset solved" : "Mark as solved"}
                onClick={() => toggleFlag(slug, "solved")}
              />
            }
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={solved ? "solved" : "mark-solved"}
                className="inline-flex items-center gap-1"
                initial={stateSwapHidden}
                animate={stateSwapVisible}
                exit={stateSwapHidden}
                transition={transition}
              >
                {solved ? <CheckIcon data-icon="inline-start" /> : null}
                {solved ? "Solved" : "Mark solved"}
              </motion.span>
            </AnimatePresence>
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

  const solved = hasFlag(slug, "solved")

  if (!solved) {
    return null
  }

  return (
    <div
      className={cn("flex items-center gap-1 text-muted-foreground", className)}
      aria-label="Solved"
    >
      <CheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
    </div>
  )
}
