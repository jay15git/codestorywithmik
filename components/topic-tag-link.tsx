import Link from "next/link"

import { topicSlugFromName } from "@/lib/content/slug"
import { cn } from "@/lib/utils"

interface TopicTagLinkProps {
  topic: string
  className?: string
}

export function TopicTagLink({ topic, className }: TopicTagLinkProps) {
  return (
    <Link
      href={`/topics/${topicSlugFromName(topic)}`}
      className={cn(
        "text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      {topic}
    </Link>
  )
}
