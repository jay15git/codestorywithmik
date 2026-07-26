import type { ReactNode } from "react"

import { DeviconLeetcode } from "@/components/icons/devicon/leetcode"
import { LogosYoutubeIcon } from "@/components/icons/logos/youtube-icon"
import { SimpleIconsGeeksforgeeks } from "@/components/icons/simple-icons/geeksforgeeks"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GFG_GREEN = "#2f8d46"

interface SolutionExternalLinksProps {
  youtubeUrl: string | null
  leetcodeUrl: string | null
  gfgUrl: string | null
  className?: string
  iconClassName?: string
  variant?: "icon" | "labeled"
}

function ExternalLinkButton({
  href,
  label,
  children,
  className,
}: {
  href: string
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className={cn("text-muted-foreground hover:text-foreground", className)}
      nativeButton={false}
      render={
        <a href={href} target="_blank" rel="noreferrer" aria-label={label} />
      }
    >
      {children}
    </Button>
  )
}

function LabeledExternalLink({
  href,
  label,
  children,
  className,
}: {
  href: string
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "relative z-10 inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      {children}
      <span>{label}</span>
    </a>
  )
}

export function SolutionExternalLinks({
  youtubeUrl,
  leetcodeUrl,
  gfgUrl,
  className,
  iconClassName,
  variant = "icon",
}: SolutionExternalLinksProps) {
  if (!youtubeUrl && !leetcodeUrl && !gfgUrl) {
    return null
  }

  if (variant === "labeled") {
    return (
      <div className={cn("relative z-10 flex flex-wrap gap-2", className)}>
        {youtubeUrl && (
          <LabeledExternalLink href={youtubeUrl} label="Video solution">
            <LogosYoutubeIcon
              className={cn("size-4", iconClassName)}
              aria-hidden="true"
            />
          </LabeledExternalLink>
        )}
        {leetcodeUrl && (
          <LabeledExternalLink href={leetcodeUrl} label="Practice">
            <DeviconLeetcode
              className={cn("size-4", iconClassName)}
              aria-hidden="true"
            />
          </LabeledExternalLink>
        )}
        {gfgUrl && (
          <LabeledExternalLink href={gfgUrl} label="Practice">
            <SimpleIconsGeeksforgeeks
              className={cn("size-4", iconClassName)}
              style={{ color: GFG_GREEN }}
              aria-hidden="true"
            />
          </LabeledExternalLink>
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative z-10 flex shrink-0 items-center gap-0.5", className)}>
      {youtubeUrl && (
        <ExternalLinkButton href={youtubeUrl} label="Watch on YouTube">
          <LogosYoutubeIcon
            className={cn("size-3.5", iconClassName)}
            aria-hidden="true"
          />
        </ExternalLinkButton>
      )}
      {leetcodeUrl && (
        <ExternalLinkButton href={leetcodeUrl} label="Open on LeetCode">
          <DeviconLeetcode
            className={cn("size-3.5", iconClassName)}
            aria-hidden="true"
          />
        </ExternalLinkButton>
      )}
      {gfgUrl && (
        <ExternalLinkButton href={gfgUrl} label="Open on GFG">
          <SimpleIconsGeeksforgeeks
            className={cn("size-3.5", iconClassName)}
            style={{ color: GFG_GREEN }}
            aria-hidden="true"
          />
        </ExternalLinkButton>
      )}
    </div>
  )
}
