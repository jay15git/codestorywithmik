"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { Markdown } from "@tiptap/markdown"
import {
  Bold,
  ChevronDown,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  SquareCode,
  Strikethrough,
  Undo2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownContent,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import { CopyButton } from "@/components/copy-button"
import { MenuItem } from "@/components/ui/menu-item"
import { Separator } from "@/components/ui/separator"
import {
  getServerNotesMap,
  readNotesMap,
  subscribeToNotes,
  writeNoteMarkdown,
} from "@/lib/notes/store"
import { cn } from "@/lib/utils"

export function SolutionNotes({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  return <SolutionNotesEditor key={slug} slug={slug} className={className} />
}

function SolutionNotesEditor({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const notesMap = useSyncExternalStore(
    subscribeToNotes,
    readNotesMap,
    getServerNotesMap
  )
  const stored = notesMap[slug]?.markdown ?? ""
  const [draft, setDraft] = useState<string | null>(null)
  const value = draft ?? stored

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Markdown,
    ],
    content: stored,
    contentType: "markdown",
    editorProps: {
      attributes: {
        class:
          "min-h-40 px-3 py-2 text-sm outline-none [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:font-medium [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
      },
    },
    onUpdate: ({ editor }) => setDraft(editor.getMarkdown()),
  })

  const formattingState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      strike: editor?.isActive("strike") ?? false,
      code: editor?.isActive("code") ?? false,
      link: editor?.isActive("link") ?? false,
      heading1: editor?.isActive("heading", { level: 1 }) ?? false,
      heading2: editor?.isActive("heading", { level: 2 }) ?? false,
      heading3: editor?.isActive("heading", { level: 3 }) ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      blockquote: editor?.isActive("blockquote") ?? false,
      codeBlock: editor?.isActive("codeBlock") ?? false,
      canUndo: editor?.can().undo() ?? false,
      canRedo: editor?.can().redo() ?? false,
    }),
  })

  useEffect(() => {
    if (!editor || draft !== null || editor.getMarkdown() === stored) {
      return
    }
    editor.commands.setContent(stored, { contentType: "markdown" })
  }, [draft, editor, stored])

  useEffect(() => {
    if (draft === null || draft === stored) {
      return
    }

    const timer = window.setTimeout(() => {
      writeNoteMarkdown(slug, draft)
    }, 400)

    return () => window.clearTimeout(timer)
  }, [draft, slug, stored])

  useEffect(() => {
    if (!editor) return
    const activeEditor = editor

    function onKeyDown(event: KeyboardEvent) {
      if (!activeEditor.view.dom.contains(event.target as Node)) return
      if (!event.metaKey && !event.ctrlKey) return

      const key = event.key.toLowerCase()
      const run = (command: () => boolean) => {
        event.preventDefault()
        command()
      }

      if (key === "z" && !event.shiftKey) {
        run(() => activeEditor.chain().focus().undo().run())
      } else if (key === "z" && event.shiftKey) {
        run(() => activeEditor.chain().focus().redo().run())
      } else if (key === "b" && !event.shiftKey) {
        run(() => activeEditor.chain().focus().toggleBold().run())
      } else if (key === "i" && !event.shiftKey) {
        run(() => activeEditor.chain().focus().toggleItalic().run())
      } else if (key === "x" && event.shiftKey) {
        run(() => activeEditor.chain().focus().toggleStrike().run())
      } else if (key === "e" && !event.shiftKey) {
        run(() => activeEditor.chain().focus().toggleCode().run())
      } else if (key === "k" && !event.shiftKey) {
        event.preventDefault()
        const previousUrl = activeEditor.getAttributes("link").href as
          string | undefined
        const url = window.prompt("Link URL", previousUrl ?? "https://")
        if (url === null) return
        if (!url) {
          activeEditor.chain().focus().extendMarkRange("link").unsetLink().run()
        } else {
          activeEditor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run()
        }
      } else if (event.altKey && ["1", "2", "3"].includes(key)) {
        const level = Number(key) as 1 | 2 | 3
        run(() => activeEditor.chain().focus().toggleHeading({ level }).run())
      } else if (event.altKey && key === "c") {
        run(() => activeEditor.chain().focus().toggleCodeBlock().run())
      } else if (event.shiftKey && key === "8") {
        run(() => activeEditor.chain().focus().toggleBulletList().run())
      } else if (event.shiftKey && key === "7") {
        run(() => activeEditor.chain().focus().toggleOrderedList().run())
      } else if (event.shiftKey && key === "b") {
        run(() => activeEditor.chain().focus().toggleBlockquote().run())
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [editor])

  function setLink() {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Link URL", previousUrl ?? "https://")

    if (url === null) return
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const toolbarButtonClass = "size-7 p-0"
  const can = editor?.can()
  const iconButton = "inline-flex shrink-0"

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <h2 className="text-lg font-medium">Your notes</h2>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div
          className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1.5"
          aria-label="Text formatting"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(toolbarButtonClass, iconButton)}
            aria-label="Undo"
            title="Undo (⌘/Ctrl+Z)"
            disabled={!formattingState?.canUndo}
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <Undo2 />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(toolbarButtonClass, iconButton)}
            aria-label="Redo"
            title="Redo (⌘/Ctrl+Shift+Z)"
            disabled={!formattingState?.canRedo}
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <Redo2 />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              toolbarButtonClass,
              iconButton,
              formattingState?.bold && "bg-accent"
            )}
            aria-label="Bold"
            title="Bold (⌘/Ctrl+B)"
            aria-pressed={formattingState?.bold}
            disabled={!can?.chain().focus().toggleBold().run()}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              toolbarButtonClass,
              iconButton,
              formattingState?.italic && "bg-accent"
            )}
            aria-label="Italic"
            title="Italic (⌘/Ctrl+I)"
            aria-pressed={formattingState?.italic}
            disabled={!can?.chain().focus().toggleItalic().run()}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              toolbarButtonClass,
              iconButton,
              formattingState?.strike && "bg-accent"
            )}
            aria-label="Strikethrough"
            title="Strikethrough (⌘/Ctrl+Shift+X)"
            aria-pressed={formattingState?.strike}
            disabled={!can?.chain().focus().toggleStrike().run()}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <Strikethrough />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              toolbarButtonClass,
              iconButton,
              formattingState?.code && "bg-accent"
            )}
            aria-label="Inline code"
            title="Inline code (⌘/Ctrl+E)"
            aria-pressed={formattingState?.code}
            disabled={!can?.chain().focus().toggleCode().run()}
            onClick={() => editor?.chain().focus().toggleCode().run()}
          >
            <Code2 />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              toolbarButtonClass,
              iconButton,
              formattingState?.link && "bg-accent"
            )}
            aria-label="Link"
            title="Link (⌘/Ctrl+K). Empty URL removes the link."
            aria-pressed={formattingState?.link}
            disabled={!editor}
            onClick={setLink}
          >
            <Link2 />
          </Button>
          <DropdownMenu disabled={!editor}>
            <DropdownTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className={cn(
                    toolbarButtonClass,
                    iconButton,
                    (formattingState?.heading1 ||
                      formattingState?.heading2 ||
                      formattingState?.heading3) &&
                      "bg-accent"
                  )}
                  aria-label="Heading style"
                  title="Heading style (⌘/Ctrl+Alt+1/2/3)"
                  aria-pressed={
                    formattingState?.heading1 ||
                    formattingState?.heading2 ||
                    formattingState?.heading3
                  }
                />
              }
            >
              {formattingState?.heading1 ? (
                <Heading1 />
              ) : formattingState?.heading3 ? (
                <Heading3 />
              ) : (
                <Heading2 />
              )}
              <ChevronDown className="size-3" />
            </DropdownTrigger>
            <DropdownContent
              className="min-w-36"
              checkedIndex={
                formattingState?.heading1
                  ? 1
                  : formattingState?.heading2
                    ? 2
                    : formattingState?.heading3
                      ? 3
                      : 0
              }
            >
              <MenuItem
                icon={Pilcrow}
                label="Paragraph"
                index={0}
                checked={
                  !formattingState?.heading1 &&
                  !formattingState?.heading2 &&
                  !formattingState?.heading3
                }
                disabled={!can?.chain().focus().setParagraph().run()}
                onSelect={() => editor?.chain().focus().setParagraph().run()}
              />
              <MenuItem
                icon={Heading1}
                label="Heading 1"
                index={1}
                checked={formattingState?.heading1}
                disabled={
                  !can?.chain().focus().toggleHeading({ level: 1 }).run()
                }
                onSelect={() =>
                  editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }
              />
              <MenuItem
                icon={Heading2}
                label="Heading 2"
                index={2}
                checked={formattingState?.heading2}
                disabled={
                  !can?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                onSelect={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
              />
              <MenuItem
                icon={Heading3}
                label="Heading 3"
                index={3}
                checked={formattingState?.heading3}
                disabled={
                  !can?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                onSelect={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
              />
            </DropdownContent>
          </DropdownMenu>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              toolbarButtonClass,
              iconButton,
              formattingState?.bulletList && "bg-accent"
            )}
            aria-label="Bulleted list"
            title="Bulleted list (⌘/Ctrl+Shift+8)"
            aria-pressed={formattingState?.bulletList}
            disabled={!can?.chain().focus().toggleBulletList().run()}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              toolbarButtonClass,
              iconButton,
              formattingState?.orderedList && "bg-accent"
            )}
            aria-label="Numbered list"
            title="Numbered list (⌘/Ctrl+Shift+7)"
            aria-pressed={formattingState?.orderedList}
            disabled={!can?.chain().focus().toggleOrderedList().run()}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              toolbarButtonClass,
              iconButton,
              formattingState?.blockquote && "bg-accent"
            )}
            aria-label="Blockquote"
            title="Blockquote (⌘/Ctrl+Shift+B)"
            aria-pressed={formattingState?.blockquote}
            disabled={!can?.chain().focus().toggleBlockquote().run()}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quote />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(
              toolbarButtonClass,
              iconButton,
              formattingState?.codeBlock && "bg-accent"
            )}
            aria-label="Code block"
            title="Code block (⌘/Ctrl+Alt+C)"
            aria-pressed={formattingState?.codeBlock}
            disabled={!can?.chain().focus().toggleCodeBlock().run()}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            <SquareCode />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(toolbarButtonClass, iconButton)}
            aria-label="Horizontal rule"
            title="Horizontal rule"
            disabled={!can?.setHorizontalRule()}
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          >
            <Minus />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={cn(toolbarButtonClass, iconButton)}
            aria-label="Clear formatting"
            title="Clear formatting"
            disabled={!can?.chain().focus().clearNodes().unsetAllMarks().run()}
            onClick={() =>
              editor?.chain().focus().clearNodes().unsetAllMarks().run()
            }
          >
            <RemoveFormatting />
          </Button>
          <div className="ml-auto">
            <CopyButton value={value} label="Copy notes" />
          </div>
        </div>
        <EditorContent editor={editor} />
      </div>
    </section>
  )
}
