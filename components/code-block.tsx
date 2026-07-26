import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  html: string
  code: string
  label: string
}

export function CodeBlock({ html, code, label }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-xl bg-card",
      )}
    >
      <div className="flex items-center justify-between border-b border-muted px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <CopyButton value={code} />
      </div>
      <div className="min-w-0 overflow-x-auto overscroll-x-contain">
        <div
          className="[&_pre]:w-max [&_pre]:max-w-none [&_pre]:font-mono [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
