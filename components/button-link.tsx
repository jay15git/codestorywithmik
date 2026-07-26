import Link from "next/link"
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

type ButtonLinkProps = ComponentProps<typeof Button> & {
  href: string
  external?: boolean
}

export function ButtonLink({
  href,
  external = false,
  className,
  "aria-label": ariaLabel,
  ...props
}: ButtonLinkProps) {
  if (external) {
    return (
      <Button
        nativeButton={false}
        className={className}
        render={
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={ariaLabel}
          />
        }
        aria-label={ariaLabel}
        {...props}
      />
    )
  }

  return (
    <Button
      nativeButton={false}
      className={className}
      render={<Link href={href} aria-label={ariaLabel} />}
      aria-label={ariaLabel}
      {...props}
    />
  )
}
