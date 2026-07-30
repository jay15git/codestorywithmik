"use client"

import { DicesIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import { Button } from "@/components/ui/button"
import type { SolutionMeta } from "@/lib/content/types"
import { matchesStatusFilter } from "@/lib/progress/store"
import { cn } from "@/lib/utils"

export function RandomProblemButton({
  solutions,
  slugs,
  unsolvedOnly = true,
  label = "Random",
  className,
  variant = "outline",
  size = "sm",
}: {
  solutions?: SolutionMeta[]
  slugs?: string[]
  unsolvedOnly?: boolean
  label?: string
  className?: string
  variant?: "outline" | "default" | "secondary" | "ghost"
  size?: "sm" | "default" | "lg"
}) {
  const router = useRouter()
  const { map } = useSolutionProgress()
  const [empty, setEmpty] = useState(false)

  const handleClick = () => {
    const candidates =
      solutions?.map((solution) => solution.slug) ?? slugs ?? []

    const pool = unsolvedOnly
      ? candidates.filter((slug) => matchesStatusFilter(map, slug, "unsolved"))
      : candidates

    if (pool.length === 0) {
      setEmpty(true)
      return
    }

    setEmpty(false)
    const pick = pool[Math.floor(Math.random() * pool.length)]
    router.push(`/solutions/${pick}`)
  }

  const disabled =
    (solutions?.length ?? 0) === 0 && (slugs?.length ?? 0) === 0

  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={disabled}
      >
        <DicesIcon data-icon="inline-start" />
        {label}
      </Button>
      {empty ? (
        <p className="text-xs text-muted-foreground">
          {unsolvedOnly
            ? "No unsolved problems in this set."
            : "No problems available."}
        </p>
      ) : null}
    </div>
  )
}
