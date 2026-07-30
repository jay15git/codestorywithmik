import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const titleUnderlineClassName =
  "motion-underline relative inline-block after:absolute after:bottom-0 after:left-1/2 after:h-[0.1em] after:w-0 after:-translate-x-1/2 after:bg-current after:transition-[width] group-hover/row:after:w-full group-focus-within/row:after:w-full"

interface TitleUnderlineProps {
  children: ReactNode
  className?: string
}

export function TitleUnderline({ children, className }: TitleUnderlineProps) {
  return <span className={cn(titleUnderlineClassName, className)}>{children}</span>
}
