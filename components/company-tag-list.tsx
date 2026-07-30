"use client"

import { useLayoutEffect, useRef, useState } from "react"

import { CompanyTagLink } from "@/components/company-tag-link"
import { cn } from "@/lib/utils"

const GAP_PX = 8
const MAX_LINES = 2

function countLines(
  itemWidths: readonly number[],
  containerWidth: number,
  gap: number,
): number {
  if (itemWidths.length === 0) {
    return 0
  }

  let lines = 1
  let lineWidth = 0

  for (const width of itemWidths) {
    const gapBefore = lineWidth > 0 ? gap : 0
    const nextWidth = lineWidth + gapBefore + width

    if (nextWidth <= containerWidth) {
      lineWidth = nextWidth
      continue
    }

    if (lineWidth > 0) {
      lines++
      lineWidth = width
    } else {
      lines++
      lineWidth = width
    }
  }

  return lines
}

function computeVisibleCount(
  itemWidths: readonly number[],
  containerWidth: number,
  moreButtonWidth: number,
  gap: number,
  maxLines: number,
): number {
  const total = itemWidths.length
  if (total === 0) {
    return 0
  }

  if (countLines(itemWidths, containerWidth, gap) <= maxLines) {
    return total
  }

  let low = 0
  let high = total
  let best = 0

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const layoutWidths =
      mid < total
        ? [...itemWidths.slice(0, mid), moreButtonWidth]
        : itemWidths.slice(0, mid)

    if (countLines(layoutWidths, containerWidth, gap) <= maxLines) {
      best = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return best
}

interface CompanyTagListProps {
  companies: string[]
  className?: string
}

export function CompanyTagList({ companies, className }: CompanyTagListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const moreMeasureRef = useRef<HTMLButtonElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [visibleCount, setVisibleCount] = useState(companies.length)

  const hasOverflow = visibleCount < companies.length

  useLayoutEffect(() => {
    if (expanded) {
      return
    }

    const container = containerRef.current
    const measure = measureRef.current
    const moreButton = moreMeasureRef.current
    if (!container || !measure || !moreButton) {
      return
    }

    const update = () => {
      const containerWidth = container.clientWidth
      if (containerWidth === 0) {
        return
      }

      const widths = [...measure.children].map(
        (child) => (child as HTMLElement).offsetWidth,
      )
      const moreWidth = moreButton.offsetWidth
      const count = computeVisibleCount(
        widths,
        containerWidth,
        moreWidth,
        GAP_PX,
        MAX_LINES,
      )

      setVisibleCount(count)
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(container)

    return () => observer.disconnect()
  }, [companies, expanded])

  if (companies.length === 0) {
    return null
  }

  const visibleCompanies = expanded
    ? companies
    : companies.slice(0, visibleCount)

  return (
    <div className={cn("relative mt-4", className)}>
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute flex flex-wrap items-center gap-2"
      >
        {companies.map((company) => (
          <span key={company} className="text-xs font-medium">
            {company}
          </span>
        ))}
      </div>

      <button
        ref={moreMeasureRef}
        type="button"
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none invisible absolute text-xs font-medium"
      >
        More
      </button>

      <div
        ref={containerRef}
        className="flex flex-wrap items-center gap-2"
      >
        {visibleCompanies.map((company) => (
          <CompanyTagLink key={company} company={company} />
        ))}

        {!expanded && hasOverflow ? (
          <button
            type="button"
            data-cuelume-press=""
            data-cuelume-release=""
            onClick={() => setExpanded(true)}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            More
          </button>
        ) : null}

        {expanded && hasOverflow ? (
          <button
            type="button"
            data-cuelume-press=""
            data-cuelume-release=""
            onClick={() => setExpanded(false)}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Show less
          </button>
        ) : null}
      </div>
    </div>
  )
}
