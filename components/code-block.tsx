import { CopyButton } from "@/components/copy-button"

interface CodeBlockProps {
  html: string
  code: string
  label: string
}

export function CodeBlock({ html, code, label }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <CopyButton value={code} />
      </div>
      <div
        className="overflow-x-auto p-4 text-sm [&_pre]:m-0 [&_pre]:bg-transparent! [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
