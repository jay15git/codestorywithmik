import type { Difficulty } from "@/lib/content/types"
import { cn } from "@/lib/utils"

const DIFFICULTY_TEXT_STYLES: Record<Difficulty, string> = {
  Easy: "text-emerald-600 dark:text-emerald-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Hard: "text-red-600 dark:text-red-400",
}

export const DIFFICULTY_COLUMN_CLASS = "w-14 shrink-0 text-xs font-medium"

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty | null | undefined
  className?: string
}) {
  if (!difficulty) {
    return null
  }

  return (
    <span
      className={cn(
        "text-xs font-medium",
        DIFFICULTY_TEXT_STYLES[difficulty],
        className,
      )}
    >
      {difficulty}
    </span>
  )
}
