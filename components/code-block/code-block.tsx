import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const CodeBlock = ({
  children,
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "not-prose flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type CodeBlockHeaderProps = ComponentProps<"div">

const CodeBlockHeader = ({
  children,
  className,
  ...props
}: CodeBlockHeaderProps) => {
  return (
    <div
      className={cn(
        "not-prose flex h-10 items-center justify-between gap-3 border-b px-3 py-1.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type CodeBlockGroupProps = ComponentProps<"div">

const CodeBlockGroup = ({
  children,
  className,
  ...props
}: CodeBlockGroupProps) => {
  return (
    <div
      className={cn("flex min-w-0 items-center gap-2 text-sm", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const CodeBlockContent = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "min-w-0 overflow-x-auto overscroll-x-contain bg-card font-mono text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { CodeBlock, CodeBlockHeader, CodeBlockGroup, CodeBlockContent }
