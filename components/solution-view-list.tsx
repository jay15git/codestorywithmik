"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { SolutionRow } from "@/components/solution-row"
import { useSolutionViewContext } from "@/components/solution-view"
import type { SolutionMeta } from "@/lib/content/types"
import { cn } from "@/lib/utils"

const viewSwap = {
  duration: 0.25,
  ease: "easeInOut" as const,
}

const viewHidden = {
  opacity: 0,
  filter: "blur(2px)",
}

const viewVisible = {
  opacity: 1,
  filter: "blur(0px)",
}

export function SolutionView({
  solutions,
  className,
}: {
  solutions: SolutionMeta[]
  className?: string
}) {
  const { viewMode } = useSolutionViewContext()
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion ? { duration: 0 } : viewSwap

  if (solutions.length === 0) {
    return null
  }

  return (
    <motion.div layout className={cn("relative", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {viewMode === "list" ? (
          <motion.div
            key="list"
            layout
            initial={viewHidden}
            animate={viewVisible}
            exit={viewHidden}
            transition={transition}
            className="solution-view-list divide-y rounded-lg border bg-card"
          >
            {solutions.map((solution) => (
              <SolutionRow
                key={solution.slug}
                solution={solution}
                variant="list"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            layout
            initial={viewHidden}
            animate={viewVisible}
            exit={viewHidden}
            transition={transition}
            className="solution-view-grid grid gap-3 md:grid-cols-2"
          >
            {solutions.map((solution) => (
              <SolutionRow
                key={solution.slug}
                solution={solution}
                variant="grid"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
