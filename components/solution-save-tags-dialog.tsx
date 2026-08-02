"use client"

import { useEffect, useState } from "react"
import { BookmarkIcon, PlusIcon, RotateCcwIcon, StarIcon } from "lucide-react"

import { useSolutionTags } from "@/components/solution-tags-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { REVISIT_TAG_ID, STARRED_TAG_ID } from "@/lib/tags/constants"
import type { UserTag } from "@/lib/tags/types"
import { cn } from "@/lib/utils"

function tagIcon(tag: UserTag) {
  if (tag.id === STARRED_TAG_ID) {
    return StarIcon
  }
  if (tag.id === REVISIT_TAG_ID) {
    return RotateCcwIcon
  }
  return null
}

export function SolutionSaveTagsDialog({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { tags, getTagIds, setTagsForSlug, createTag } = useSolutionTags()
  const [open, setOpen] = useState(false)
  const [draftIds, setDraftIds] = useState<string[]>([])
  const [newTagName, setNewTagName] = useState("")

  useEffect(() => {
    if (open) {
      setDraftIds(getTagIds(slug))
      setNewTagName("")
    }
  }, [open, slug, getTagIds])

  const assignedCount = getTagIds(slug).length
  const defaultTags = tags.filter((tag) => tag.kind === "default")
  const customTags = tags.filter((tag) => tag.kind === "custom")

  function toggleDraft(tagId: string) {
    setDraftIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    )
  }

  function handleApply() {
    setTagsForSlug(slug, draftIds)
    setOpen(false)
  }

  function handleCreateTag() {
    const trimmed = newTagName.trim()
    if (!trimmed) {
      return
    }

    const tag = createTag(trimmed)
    setNewTagName("")
    setDraftIds((current) =>
      current.includes(tag.id) ? current : [...current, tag.id]
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant={assignedCount > 0 ? "default" : "outline"}
            size="sm"
            className={className}
            aria-label="Save tags"
          />
        }
      >
        <BookmarkIcon data-icon="inline-start" />
        Save
        {assignedCount > 0 ? (
          <span className="tabular-nums">({assignedCount})</span>
        ) : null}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save problem</DialogTitle>
          <DialogDescription>
            Tag this problem for your study plan. Starred and Revisit are always
            available.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <TagChecklist
            title="Default tags"
            tags={defaultTags}
            draftIds={draftIds}
            onToggle={toggleDraft}
          />
          {customTags.length > 0 ? (
            <TagChecklist
              title="Your tags"
              tags={customTags}
              draftIds={draftIds}
              onToggle={toggleDraft}
            />
          ) : null}
          <div className="flex gap-2">
            <Input
              value={newTagName}
              placeholder="New tag name"
              onChange={(event) => setNewTagName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleCreateTag()
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Create tag"
              onClick={handleCreateTag}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TagChecklist({
  title,
  tags,
  draftIds,
  onToggle,
}: {
  title: string
  tags: UserTag[]
  draftIds: string[]
  onToggle: (tagId: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <ul className="flex flex-col gap-1">
        {tags.map((tag) => {
          const checked = draftIds.includes(tag.id)
          const Icon = tagIcon(tag)
          return (
            <li key={tag.id}>
              <button
                type="button"
                className={cn(
                  "t-tactile flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-[background-color,transform] hover:bg-muted/60",
                  checked && "bg-muted/40"
                )}
                onClick={() => onToggle(tag.id)}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border",
                    checked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40"
                  )}
                >
                  {checked ? "✓" : null}
                </span>
                {Icon ? (
                  <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                ) : null}
                <span>{tag.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
