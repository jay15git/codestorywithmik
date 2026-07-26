import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ButtonLinkProps = ComponentProps<typeof Button> & {
  href: string
  external?: boolean
}

export function ButtonLink({
  href,
  external = false,
  className,
  ...props
}: ButtonLinkProps) {
  if (external) {
    return (
      <Button
        nativeButton={false}
        className={className}
        render={<a href={href} target="_blank" rel="noreferrer" />}
        {...props}
      />
    )
  }

  return (
    <Button
      nativeButton={false}
      className={className}
      render={<Link href={href} />}
      {...props}
    />
  )
}

export function BadgeLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  )
}
