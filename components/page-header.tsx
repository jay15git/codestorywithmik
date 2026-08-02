import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  meta,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start",
        className
      )}
    >
      <div className="min-w-0 space-y-2">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="min-w-0 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          {meta ? (
            <div className="text-sm text-muted-foreground tabular-nums">
              {meta}
            </div>
          ) : null}
        </div>
        {description ? (
          <div className="max-w-2xl text-sm leading-6 text-pretty text-muted-foreground sm:text-base">
            {description}
          </div>
        ) : null}
        {children}
      </div>
      {actions ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      ) : null}
    </header>
  )
}

export type { PageHeaderProps }
