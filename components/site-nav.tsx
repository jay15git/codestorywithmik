"use client"

import Link from "next/link"
import { ChevronDownIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownContent,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import { MenuItem } from "@/components/ui/menu-item"
import { cn } from "@/lib/utils"

export const SITE_NAV_LINKS = [
  { href: "/problems", label: "Problems", match: "/problems" },
  { href: "/lists", label: "Lists", match: "/lists" },
  { href: "/plans", label: "Plans", match: "/plans" },
  { href: "/settings", label: "Settings", match: "/settings" },
] as const

export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const activeLink = SITE_NAV_LINKS.find(
    (link) => pathname === link.match || pathname.startsWith(`${link.match}/`)
  )
  const mobilePrimary = activeLink ?? SITE_NAV_LINKS[0]
  const mobileMenuLinks = SITE_NAV_LINKS.filter(
    (link) => link.href !== mobilePrimary.href
  )

  return (
    <nav
      aria-label="Site"
      className={cn("flex min-w-0 items-center gap-0.5", className)}
    >
      <div className="flex min-w-0 items-center gap-0.5 sm:hidden">
        <Link
          href={mobilePrimary.href}
          aria-current={activeLink ? "page" : undefined}
          data-cuelume-press=""
          data-cuelume-release=""
          className={cn(
            "t-tactile duration-quick flex h-10 shrink-0 items-center rounded-lg px-2.5 text-sm font-medium transition-[background-color,color,transform] ease-smooth-out",
            activeLink
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          {mobilePrimary.label}
        </Link>
        <DropdownMenu>
          <DropdownTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-10 text-muted-foreground"
                aria-label="More destinations"
              />
            }
          >
            <ChevronDownIcon />
          </DropdownTrigger>
          <DropdownContent align="start" className="min-w-40">
            {mobileMenuLinks.map((link, index) => (
              <MenuItem
                key={link.href}
                label={link.label}
                index={index}
                checked={link === activeLink}
                onSelect={() => router.push(link.href)}
              />
            ))}
          </DropdownContent>
        </DropdownMenu>
      </div>

      <div className="hidden min-w-0 items-center gap-0.5 sm:flex">
        {SITE_NAV_LINKS.map((link) => {
          const active =
            pathname === link.match || pathname.startsWith(`${link.match}/`)

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              data-cuelume-press=""
              data-cuelume-release=""
              className={cn(
                "t-tactile duration-quick flex h-10 shrink-0 items-center rounded-lg px-2.5 text-sm font-medium transition-[background-color,color,transform] ease-smooth-out",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
