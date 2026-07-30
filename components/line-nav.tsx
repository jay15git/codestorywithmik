/**
 * This component is inspired by Devouring Details and Skiper UI.
 */

import Link from "next/link"

import { cn } from "@/lib/utils"

const LINE_WIDTH_NORMAL = 24

export type LineNavItem = {
  title: string
  href: string
  prefix?: string
}

export type LineNavProps = {
  className?: string
  items: LineNavItem[]
  activeHref?: string
  activeItemRef?: React.Ref<HTMLAnchorElement>
  onItemClick?: (
    item: LineNavItem,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void
}

export function LineNav({
  className,
  items,
  activeHref,
  activeItemRef,
  onItemClick,
}: LineNavProps) {
  return (
    <nav
      className={cn("flex flex-col gap-2 py-5.25", className)}
      style={
        {
          "--line-nav-width": `${LINE_WIDTH_NORMAL}px`,
        } as React.CSSProperties
      }
    >
      {items.map((item, index) => {
        const isActive = item.href === activeHref

        return (
          <LineNavItem
            key={item.href}
            ref={isActive ? activeItemRef : undefined}
            title={item.title}
            href={item.href}
            prefix={item.prefix}
            active={isActive}
            isLast={index === items.length - 1}
            onClick={
              onItemClick ? (event) => onItemClick(item, event) : undefined
            }
          />
        )
      })}
    </nav>
  )
}

function LineNavItem({
  ref,
  title,
  href,
  prefix,
  active = false,
  isLast = false,
  onClick,
}: {
  ref?: React.Ref<HTMLAnchorElement>
  title: string
  href: string
  prefix?: string
  active?: boolean
  isLast?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  return (
    <>
      <Link
        ref={ref}
        aria-current={active ? "page" : undefined}
        data-cuelume-hover="tick"
        data-cuelume-press=""
        data-cuelume-release=""
        className="group/line-nav relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5"
        href={href}
        onClick={onClick}
      >
        <span
          className={cn(
            "block h-px shrink-0 bg-foreground/20 motion-line motion-reduce:transition-none",
            active
              ? "w-10 bg-foreground"
              : "w-6 group-hover/line-nav:w-10 group-hover/line-nav:bg-foreground",
          )}
        />
        <span className="motion-line flex items-center whitespace-nowrap text-sm text-muted-foreground motion-reduce:transition-none group-hover/line-nav:text-foreground group-aria-[current=page]/line-nav:text-foreground">
          {prefix && (
            <span className="mr-4 min-w-[1.25rem] text-xs tabular-nums text-muted-foreground/40 group-hover/line-nav:text-muted-foreground/60 group-aria-[current=page]/line-nav:text-muted-foreground/70">
              {prefix}
            </span>
          )}
          <span>{title}</span>
        </span>
      </Link>

      {!isLast && (
        <>
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
        </>
      )}
    </>
  )
}
