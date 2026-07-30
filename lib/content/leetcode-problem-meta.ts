import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"

import {
  LEETCODE_PROBLEM_META_CACHE_PATH,
  LEETCODE_PROBLEM_META_SEED_PATH,
} from "./constants"
import type { Difficulty } from "./types"

export interface LeetcodeProblemMeta {
  leetcodeId: number
  title: string
  titleSlug: string
  difficulty: Difficulty
  topicTags: string[]
}

export type LeetcodeProblemMetaById = Map<number, LeetcodeProblemMeta>
export type LeetcodeProblemMetaBySlug = Map<string, LeetcodeProblemMeta>

const GRAPHQL_URL = "https://leetcode.com/graphql"
const PAGE_SIZE = 100

const PROBLEMSET_QUERY = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      questionFrontendId
      title
      titleSlug
      difficulty
      topicTags {
        name
      }
    }
  }
}
`

interface GraphqlQuestion {
  questionFrontendId: string
  title: string
  titleSlug: string
  difficulty: string
  topicTags: Array<{ name: string }>
}

interface GraphqlResponse {
  data?: {
    problemsetQuestionList?: {
      total: number
      questions: GraphqlQuestion[]
    }
  }
}

function normalizeDifficulty(value: string): Difficulty {
  const normalized = value.trim()
  if (normalized === "Easy" || normalized === "Medium" || normalized === "Hard") {
    return normalized
  }

  throw new Error(`Unexpected LeetCode difficulty: ${value}`)
}

function parseMetaFile(raw: string): LeetcodeProblemMeta[] {
  const parsed = JSON.parse(raw) as LeetcodeProblemMeta[]
  if (!Array.isArray(parsed)) {
    throw new Error("LeetCode problem meta file must be a JSON array")
  }

  return parsed
}

function toMetaMaps(
  entries: LeetcodeProblemMeta[],
): {
  byId: LeetcodeProblemMetaById
  bySlug: LeetcodeProblemMetaBySlug
} {
  const byId: LeetcodeProblemMetaById = new Map()
  const bySlug: LeetcodeProblemMetaBySlug = new Map()

  for (const entry of entries) {
    byId.set(entry.leetcodeId, entry)
    bySlug.set(entry.titleSlug, entry)
  }

  return { byId, bySlug }
}

async function fetchProblemsetPage(skip: number): Promise<{
  total: number
  questions: GraphqlQuestion[]
}> {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: PROBLEMSET_QUERY,
      variables: {
        categorySlug: "",
        skip,
        limit: PAGE_SIZE,
        filters: {},
      },
    }),
  })

  if (!response.ok) {
    throw new Error(
      `LeetCode GraphQL failed (${response.status} ${response.statusText})`,
    )
  }

  const payload = (await response.json()) as GraphqlResponse
  const page = payload.data?.problemsetQuestionList

  if (!page) {
    throw new Error("LeetCode GraphQL returned no problemsetQuestionList data")
  }

  return page
}

async function fetchAllProblemMeta(): Promise<LeetcodeProblemMeta[]> {
  const firstPage = await fetchProblemsetPage(0)
  const allQuestions = [...firstPage.questions]

  for (let skip = PAGE_SIZE; skip < firstPage.total; skip += PAGE_SIZE) {
    const page = await fetchProblemsetPage(skip)
    allQuestions.push(...page.questions)
  }

  return allQuestions.map((question) => ({
    leetcodeId: Number.parseInt(question.questionFrontendId, 10),
    title: question.title,
    titleSlug: question.titleSlug,
    difficulty: normalizeDifficulty(question.difficulty),
    topicTags: question.topicTags.map((tag) => tag.name),
  }))
}

function readMetaFromPath(filePath: string): LeetcodeProblemMeta[] {
  return parseMetaFile(readFileSync(filePath, "utf8"))
}

function writeMetaCache(entries: LeetcodeProblemMeta[]): void {
  const cachePath = path.join(process.cwd(), LEETCODE_PROBLEM_META_CACHE_PATH)
  mkdirSync(path.dirname(cachePath), { recursive: true })
  writeFileSync(cachePath, JSON.stringify(entries, null, 2))
}

export async function loadLeetcodeProblemMeta(): Promise<{
  byId: LeetcodeProblemMetaById
  bySlug: LeetcodeProblemMetaBySlug
}> {
  const cachePath = path.join(process.cwd(), LEETCODE_PROBLEM_META_CACHE_PATH)
  const seedPath = path.join(process.cwd(), LEETCODE_PROBLEM_META_SEED_PATH)

  try {
    console.log("Fetching LeetCode problem metadata...")
    const entries = await fetchAllProblemMeta()
    writeMetaCache(entries)
    console.log(`Fetched metadata for ${entries.length} LeetCode problems`)
    return toMetaMaps(entries)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`LeetCode metadata fetch failed: ${message}`)

    if (existsSync(cachePath)) {
      console.log(`Using cached metadata from ${LEETCODE_PROBLEM_META_CACHE_PATH}`)
      return toMetaMaps(readMetaFromPath(cachePath))
    }

    if (existsSync(seedPath)) {
      console.log(`Using seed metadata from ${LEETCODE_PROBLEM_META_SEED_PATH}`)
      return toMetaMaps(readMetaFromPath(seedPath))
    }

    throw new Error(
      "No LeetCode problem metadata available (fetch failed and no cache/seed found)",
    )
  }
}
