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
        "inline-flex h-5 w-fit shrink-0 items-center justify-center rounded-4xl border border-transparent bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80",
        className,
      )}
    >
      {children}
    </Link>
  )
}
