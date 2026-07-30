"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export const SITE_NAV_LINKS = [
  { href: "/problems", label: "Problems", match: "/problems" },
  { href: "/lists", label: "Lists", match: "/lists" },
  { href: "/plans", label: "Plans", match: "/plans" },
  { href: "/daily", label: "Daily", match: "/daily" },
  { href: "/review", label: "Review", match: "/review" },
  { href: "/settings", label: "Settings", match: "/settings" },
] as const

export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Site"
      className={cn(
        "flex min-w-0 items-center gap-0.5 overflow-x-auto",
        className,
      )}
    >
      {SITE_NAV_LINKS.map((link) => {
        const active =
          pathname === link.match || pathname.startsWith(`${link.match}/`)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
