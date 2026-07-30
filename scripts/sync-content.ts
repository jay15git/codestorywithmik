import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { execSync } from "node:child_process"
import path from "node:path"

import {
  CONTENT_BRANCH,
  CONTENT_CACHE_PATH,
  CONTENT_REPO,
  CONTENT_REPO_SLUG,
  CONTENT_SUBMODULE_PATH,
  GENERATED_INDEX_PATH,
  GENERATED_SEARCH_INDEX_PATH,
  GENERATED_SOLUTIONS_PATH,
  ORIGINAL_REPO_SLUG,
  PUBLIC_SEARCH_INDEX_PATH,
} from "../lib/content/constants"
import {
  enrichCompanyTags,
  loadLeetcodeCompanyTagIndex,
} from "../lib/content/leetcode-company-tags"
import { loadLeetcodeProblemMeta } from "../lib/content/leetcode-problem-meta"
import { buildSearchIndex } from "../lib/content/search-index"
import { slugify, topicSlugFromName } from "../lib/content/slug"
import {
  LANGUAGE_TO_GENERATED_EXTENSION,
  WALKCCC_EXTENSION_TO_LANGUAGE,
} from "../lib/content/solution-languages"
import type { ContentIndex, SolutionMeta, Topic } from "../lib/content/types"
import {
  walkWalkcccSolutions,
  WALKCCC_LANGUAGE_EXTENSIONS,
} from "../lib/content/walkccc-source"

function resolveSourceDir(): string {
  const submodulePath = path.join(process.cwd(), CONTENT_SUBMODULE_PATH)
  if (existsSync(path.join(submodulePath, ".git"))) {
    return submodulePath
  }

  const cachePath = path.join(process.cwd(), CONTENT_CACHE_PATH)

  if (existsSync(path.join(cachePath, ".git"))) {
    console.log("Updating cached content repo...")
    execSync(`git fetch origin && git reset --hard origin/${CONTENT_BRANCH}`, {
      cwd: cachePath,
      stdio: "inherit",
    })
    return cachePath
  }

  mkdirSync(path.dirname(cachePath), { recursive: true })
  console.log(`Cloning ${CONTENT_REPO}...`)
  execSync(
    `git clone --depth 1 --branch ${CONTENT_BRANCH} ${CONTENT_REPO} ${cachePath}`,
    { stdio: "inherit" },
  )
  return cachePath
}

function getUpstreamSha(sourceDir: string): string {
  return execSync("git rev-parse HEAD", {
    cwd: sourceDir,
    encoding: "utf8",
  }).trim()
}

function buildSolutionMeta(
  entry: ReturnType<typeof walkWalkcccSolutions>[number],
  metaById: Awaited<ReturnType<typeof loadLeetcodeProblemMeta>>["byId"],
  leetcodeCompanyTagIndex: ReturnType<typeof loadLeetcodeCompanyTagIndex>,
): SolutionMeta {
  const meta = metaById.get(entry.leetcodeId)
  const titleSlug =
    meta?.titleSlug ??
    entry.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  const topicTags = meta?.topicTags ?? []
  const primaryTopic = topicTags[0] ?? "Uncategorized"
  const leetcodeUrl = `https://leetcode.com/problems/${titleSlug}/`

  return {
    slug: titleSlug,
    title: meta?.title ?? entry.title,
    leetcodeId: entry.leetcodeId,
    topic: primaryTopic,
    topicSlug: topicSlugFromName(primaryTopic),
    topicTags,
    subtopic: null,
    subtopicSlug: null,
    relativePath: entry.primaryRelativePath,
    githubUrl: `https://github.com/${ORIGINAL_REPO_SLUG}/blob/${CONTENT_BRANCH}/${entry.primaryRelativePath}`,
    youtubeUrl: null,
    leetcodeUrl,
    gfgUrl: null,
    ...enrichCompanyTags([], leetcodeUrl, leetcodeCompanyTagIndex),
    timeComplexity: null,
    spaceComplexity: null,
    difficulty: meta?.difficulty ?? null,
  }
}

function buildTopics(solutions: SolutionMeta[]): Topic[] {
  const topicMap = new Map<string, Topic>()

  for (const solution of solutions) {
    const tags =
      solution.topicTags.length > 0 ? solution.topicTags : [solution.topic]

    for (const tagName of tags) {
      const slug = topicSlugFromName(tagName)
      let topic = topicMap.get(slug)

      if (!topic) {
        topic = {
          name: tagName,
          slug,
          solutionCount: 0,
          subtopics: [],
        }
        topicMap.set(slug, topic)
      }

      topic.solutionCount += 1
    }
  }

  return [...topicMap.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  )
}

function buildCompanyList(solutions: SolutionMeta[]): string[] {
  const bySlug = new Map<string, string>()

  for (const solution of solutions) {
    for (const company of solution.companyTags) {
      const companySlug = slugify(company)
      if (!bySlug.has(companySlug)) {
        bySlug.set(companySlug, company)
      }
    }
  }

  return [...bySlug.values()].sort((left, right) => left.localeCompare(right))
}

function main() {
  void run()
}

async function run() {
  const sourceDir = resolveSourceDir()
  const upstreamSha = getUpstreamSha(sourceDir)

  const generatedDir = path.join(process.cwd(), "generated")
  const solutionsDir = path.join(process.cwd(), GENERATED_SOLUTIONS_PATH)
  const indexPath = path.join(process.cwd(), GENERATED_INDEX_PATH)

  rmSync(solutionsDir, { recursive: true, force: true })
  mkdirSync(solutionsDir, { recursive: true })
  mkdirSync(generatedDir, { recursive: true })

  const walkcccEntries = walkWalkcccSolutions(sourceDir)
  console.log(`Found ${walkcccEntries.length} walkccc solution files`)

  const [{ byId: metaById }, leetcodeCompanyTagIndex] = await Promise.all([
    loadLeetcodeProblemMeta(),
    Promise.resolve(loadLeetcodeCompanyTagIndex()),
  ])

  console.log(
    `Loaded company tags for ${leetcodeCompanyTagIndex.size} LeetCode problems`,
  )

  const solutions = walkcccEntries
    .map((entry) => buildSolutionMeta(entry, metaById, leetcodeCompanyTagIndex))
    .sort((left, right) => {
      const leftId = left.leetcodeId ?? Number.MAX_SAFE_INTEGER
      const rightId = right.leetcodeId ?? Number.MAX_SAFE_INTEGER
      if (leftId !== rightId) {
        return leftId - rightId
      }

      return left.title.localeCompare(right.title)
    })

  const missingMeta = solutions.filter(
    (solution) => solution.topicTags.length === 0 || !solution.difficulty,
  )
  if (missingMeta.length > 0) {
    console.warn(
      `Missing LeetCode metadata for ${missingMeta.length} solutions (topic tags and/or difficulty)`,
    )
  }

  for (const entry of walkcccEntries) {
    const solution = solutions.find(
      (item) => item.leetcodeId === entry.leetcodeId,
    )
    if (!solution) {
      continue
    }

    for (const extension of WALKCCC_LANGUAGE_EXTENSIONS) {
      const relativePath = entry.languagePaths[extension]
      if (!relativePath) {
        continue
      }

      const language = WALKCCC_EXTENSION_TO_LANGUAGE[extension]
      const generatedExtension = LANGUAGE_TO_GENERATED_EXTENSION[language]

      cpSync(
        path.join(sourceDir, relativePath),
        path.join(solutionsDir, `${solution.slug}.${generatedExtension}`),
      )
    }
  }

  const companies = buildCompanyList(solutions)
  const topics = buildTopics(solutions)

  const index: ContentIndex = {
    upstreamSha,
    syncedAt: new Date().toISOString(),
    contentRepo: CONTENT_REPO_SLUG,
    originalRepo: ORIGINAL_REPO_SLUG,
    solutionCount: solutions.length,
    topicCount: topics.length,
    companyCount: companies.length,
    topics,
    solutions,
    companies,
  }

  const searchIndex = buildSearchIndex(index.solutions, index.topics)
  const searchIndexPath = path.join(process.cwd(), GENERATED_SEARCH_INDEX_PATH)
  const publicSearchIndexPath = path.join(process.cwd(), PUBLIC_SEARCH_INDEX_PATH)

  mkdirSync(path.dirname(publicSearchIndexPath), { recursive: true })

  writeFileSync(indexPath, JSON.stringify(index, null, 2))
  writeFileSync(searchIndexPath, JSON.stringify(searchIndex))
  writeFileSync(publicSearchIndexPath, JSON.stringify(searchIndex))

  console.log(`Wrote ${index.solutionCount} solutions to ${indexPath}`)
  console.log(`Wrote search index to ${searchIndexPath}`)
}

main()
