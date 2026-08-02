"use client"

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react"
import { motion, useReducedMotion } from "framer-motion"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
} from "@/components/code-block/code-block"
import { CopyButton } from "@/components/copy-button"
import { ExplainWithAiDropdown } from "@/components/explain-with-ai-dropdown"
import { ShareSolutionLinkButton } from "@/components/share-solution-link-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getAvailableLanguages,
  SOLUTION_LANGUAGE_LABELS,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"
import type { Difficulty } from "@/lib/content/types"
import {
  getServerLanguagePreference,
  pickPreferredLanguage,
  readLanguagePreference,
  subscribeToLanguagePreference,
  writeLanguagePreference,
} from "@/lib/preferences/language"
import { sanitizeShikiHtml } from "@/lib/sanitize-shiki-html"
import { cn } from "@/lib/utils"

interface SolutionCodePanelProps {
  slug: string
  title: string
  code: Record<SolutionLanguage, string | null>
  highlighted: Partial<Record<SolutionLanguage, string | null>>
  initialLang?: SolutionLanguage | null
  topic?: string | null
  difficulty?: Difficulty | null
  timeComplexity?: string | null
  spaceComplexity?: string | null
  leetcodeUrl?: string | null
  gfgUrl?: string | null
}

function HighlightedCode({ html }: { html: string }) {
  return (
    <div
      className="[&_code]:font-mono [&_pre]:w-max [&_pre]:max-w-none [&_pre]:font-mono"
      dangerouslySetInnerHTML={{ __html: sanitizeShikiHtml(html) }}
    />
  )
}

function syncLangQuery(language: SolutionLanguage) {
  if (typeof window === "undefined") {
    return
  }

  const url = new URL(window.location.href)
  if (url.searchParams.get("lang") === language) {
    return
  }

  url.searchParams.set("lang", language)
  window.history.replaceState(window.history.state, "", url.toString())
}

export function SolutionCodePanel({
  slug,
  title,
  code,
  highlighted,
  initialLang = null,
  topic = null,
  difficulty = null,
  timeComplexity = null,
  spaceComplexity = null,
  leetcodeUrl = null,
  gfgUrl = null,
}: SolutionCodePanelProps) {
  const resizeRef = useRef<HTMLDivElement>(null)
  const resizeContentRef = useRef<HTMLDivElement>(null)
  const previousTabRef = useRef<SolutionLanguage | null>(null)
  const reduceMotion = useReducedMotion()
  const languages = useMemo(
    () =>
      getAvailableLanguages(code).filter(
        (language) => code[language] && highlighted[language]
      ),
    [code, highlighted]
  )

  const preferred = useSyncExternalStore(
    subscribeToLanguagePreference,
    readLanguagePreference,
    getServerLanguagePreference
  )

  const activeTab = pickPreferredLanguage(languages, preferred, initialLang)

  useLayoutEffect(() => {
    const previousTab = previousTabRef.current
    previousTabRef.current = activeTab

    if (!previousTab || previousTab === activeTab) {
      return
    }

    const card = resizeRef.current
    const content = resizeContentRef.current
    if (!card || !content) {
      return
    }

    if (reduceMotion) {
      card.style.height = ""
      return
    }

    const frame = requestAnimationFrame(() => {
      card.style.height = `${content.getBoundingClientRect().height}px`
    })

    const releaseHeight = () => {
      card.style.height = ""
    }
    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === "height") {
        releaseHeight()
      }
    }

    card.addEventListener("transitionend", handleTransitionEnd)
    const fallback = window.setTimeout(releaseHeight, 350)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(fallback)
      card.removeEventListener("transitionend", handleTransitionEnd)
    }
  }, [activeTab, reduceMotion])

  useEffect(() => {
    if (initialLang && languages.includes(initialLang)) {
      writeLanguagePreference(initialLang)
    }
  }, [initialLang, languages])

  useEffect(() => {
    if (languages.length === 0 || !languages.includes(activeTab)) {
      return
    }

    syncLangQuery(activeTab)
  }, [activeTab, languages])

  if (languages.length === 0) {
    return null
  }

  function handleTabChange(value: string) {
    const language = value as SolutionLanguage
    const card = resizeRef.current
    if (card && !reduceMotion && language !== activeTab) {
      card.style.height = `${card.getBoundingClientRect().height}px`
    }
    writeLanguagePreference(language)
    syncLangQuery(language)
  }

  if (languages.length === 1) {
    const language = languages[0]
    return (
      <CodeBlock>
        <CodeBlockHeader>
          <span className="text-xs font-medium text-muted-foreground">
            {SOLUTION_LANGUAGE_LABELS[language]}
          </span>
          <div className="flex items-center gap-0.5">
            <ExplainWithAiDropdown
              title={title}
              language={language}
              code={code[language]!}
              topic={topic}
              difficulty={difficulty}
              timeComplexity={timeComplexity}
              spaceComplexity={spaceComplexity}
              leetcodeUrl={leetcodeUrl}
              gfgUrl={gfgUrl}
            />
            <ShareSolutionLinkButton slug={slug} language={language} />
            <CopyButton value={code[language]!} />
          </div>
        </CodeBlockHeader>
        <CodeBlockContent>
          <HighlightedCode html={highlighted[language]!} />
        </CodeBlockContent>
      </CodeBlock>
    )
  }

  const copyValue = code[activeTab] ?? languages[0]

  return (
    <div ref={resizeRef} className="t-resize overflow-hidden rounded-xl">
      <div ref={resizeContentRef}>
        <CodeBlock>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="gap-0"
          >
            <CodeBlockHeader>
              <TabsList
                variant="line"
                className="h-8 gap-1 bg-transparent p-0 text-muted-foreground"
              >
                {languages.map((language) => (
                  <TabsTrigger
                    key={language}
                    value={language}
                    className={cn(
                      "h-7 px-2 text-xs data-active:bg-transparent",
                      "data-active:text-foreground"
                    )}
                  >
                    {SOLUTION_LANGUAGE_LABELS[language]}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex items-center gap-0.5">
                <ExplainWithAiDropdown
                  title={title}
                  language={activeTab}
                  code={code[activeTab]!}
                  topic={topic}
                  difficulty={difficulty}
                  timeComplexity={timeComplexity}
                  spaceComplexity={spaceComplexity}
                  leetcodeUrl={leetcodeUrl}
                  gfgUrl={gfgUrl}
                />
                <ShareSolutionLinkButton slug={slug} language={activeTab} />
                <CopyButton value={copyValue!} />
              </div>
            </CodeBlockHeader>

            <CodeBlockContent>
              <TabsContent value={activeTab} className="mt-0 outline-none">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, filter: "blur(2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.2, ease: "easeInOut" }
                  }
                >
                  <HighlightedCode html={highlighted[activeTab]!} />
                </motion.div>
              </TabsContent>
            </CodeBlockContent>
          </Tabs>
        </CodeBlock>
      </div>
    </div>
  )
}
