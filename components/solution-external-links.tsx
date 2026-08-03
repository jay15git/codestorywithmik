import type { ReactNode } from "react"

import { DeviconLeetcode } from "@/components/icons/devicon/leetcode"
import { LogosYoutubeIcon } from "@/components/icons/logos/youtube-icon"
import { SimpleIconsGeeksforgeeks } from "@/components/icons/simple-icons/geeksforgeeks"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GFG_GREEN = "#2f8d46"

const iconButtonClassName =
  "pointer-events-auto relative z-10 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"

const labeledLinkClassName =
  "pointer-events-auto relative z-10 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"

interface SolutionExternalLinksProps {
  youtubeUrl: string | null
  leetcodeUrl: string | null
  gfgUrl: string | null
  className?: string
  iconClassName?: string
  variant?: "icon" | "labeled"
  iconLayout?: "inline" | "slots"
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
      className={cn(iconButtonClassName, className)}
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
      className={cn(labeledLinkClassName, className)}
    >
      {children}
      {label}
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
  iconLayout = "inline",
}: SolutionExternalLinksProps) {
  if (!youtubeUrl && !leetcodeUrl && !gfgUrl) {
    return null
  }

  if (variant === "labeled") {
    return (
      <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
        {youtubeUrl && (
          <LabeledExternalLink href={youtubeUrl} label="Solution">
            <LogosYoutubeIcon
              className={cn("size-4 shrink-0", iconClassName)}
              aria-hidden="true"
            />
          </LabeledExternalLink>
        )}
        {leetcodeUrl && (
          <LabeledExternalLink href={leetcodeUrl} label="Practice">
            <DeviconLeetcode
              className={cn("size-4 shrink-0", iconClassName)}
              aria-hidden="true"
            />
          </LabeledExternalLink>
        )}
        {gfgUrl && (
          <LabeledExternalLink href={gfgUrl} label="Practice">
            <SimpleIconsGeeksforgeeks
              className={cn("size-4 shrink-0", iconClassName)}
              style={{ color: GFG_GREEN }}
              aria-hidden="true"
            />
          </LabeledExternalLink>
        )}
      </div>
    )
  }

  if (iconLayout === "slots") {
    const practiceUrl = leetcodeUrl ?? gfgUrl
    const practiceLabel = leetcodeUrl ? "Open on LeetCode" : "Open on GFG"

    return (
      <div className={cn("flex shrink-0 justify-end gap-0.5", className)}>
        <div className="flex size-6 items-center justify-center">
          {youtubeUrl ? (
            <ExternalLinkButton href={youtubeUrl} label="Watch on YouTube">
              <LogosYoutubeIcon
                className={cn("size-4", iconClassName)}
                aria-hidden="true"
              />
            </ExternalLinkButton>
          ) : null}
        </div>
        <div className="flex size-6 items-center justify-center">
          {practiceUrl ? (
            <ExternalLinkButton href={practiceUrl} label={practiceLabel}>
              {leetcodeUrl ? (
                <DeviconLeetcode
                  className={cn("size-4", iconClassName)}
                  aria-hidden="true"
                />
              ) : (
                <SimpleIconsGeeksforgeeks
                  className={cn("size-4", iconClassName)}
                  style={{ color: GFG_GREEN }}
                  aria-hidden="true"
                />
              )}
            </ExternalLinkButton>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex shrink-0 items-center gap-0.5", className)}>
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
