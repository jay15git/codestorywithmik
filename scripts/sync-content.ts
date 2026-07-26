import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
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
  GENERATED_SOLUTIONS_PATH,
  ORIGINAL_REPO_SLUG,
} from "../lib/content/constants"
import {
  parseCompanyTags,
  parseSpaceComplexity,
  parseTimeComplexity,
  parseYoutubeUrl,
  resolveProblemLinks,
} from "../lib/content/parse-solution"
import { slugify, slugifyParts, topicSlugFromName } from "../lib/content/slug"
import type { ContentIndex, SolutionMeta, Subtopic, Topic } from "../lib/content/types"

const TOP_LEVEL_SKIP = new Set([
  ".git",
  ".github",
  "LICENSE",
  "README.md",
  "codestorywithmik.png",
  "github-user-contribution.svg",
  "icon.png",
  "icons8-youtube.gif",
  "iPad PDF Notes",
])

function resolveSourceDir(): string {
  const submodulePath = path.join(process.cwd(), CONTENT_SUBMODULE_PATH)
  if (existsSync(path.join(submodulePath, ".git"))) {
    return submodulePath
  }

  const cachePath = path.join(process.cwd(), CONTENT_CACHE_PATH)

  if (existsSync(path.join(cachePath, ".git"))) {
    console.log("Updating cached content repo...")
    execSync("git fetch origin && git reset --hard origin/master", {
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

function isTopicDirectory(name: string): boolean {
  return !TOP_LEVEL_SKIP.has(name) && !name.startsWith(".")
}

function walkCppFiles(
  dir: string,
  relativePrefix = "",
): Array<{ relativePath: string; absolutePath: string }> {
  const entries = readdirSync(dir)
  const files: Array<{ relativePath: string; absolutePath: string }> = []

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry)
    const relativePath = relativePrefix ? `${relativePrefix}/${entry}` : entry

    if (statSync(absolutePath).isDirectory()) {
      files.push(...walkCppFiles(absolutePath, relativePath))
      continue
    }

    if (entry.toLowerCase().endsWith(".cpp")) {
      files.push({ relativePath, absolutePath })
    }
  }

  return files
}

function parseSolutionFile(
  relativePath: string,
  content: string,
  upstreamSha: string,
): SolutionMeta {
  const segments = relativePath.split("/")
  const fileName = segments.at(-1) ?? relativePath
  const title = fileName.replace(/\.cpp$/i, "")
  const topic = segments[0] ?? "Unknown"
  const subtopic =
    segments.length > 2 ? segments.slice(1, -1).join(" / ") : null

  const slug = slugifyParts(...segments.map((part) => part.replace(/\.cpp$/i, "")))
  const problemLinks = resolveProblemLinks(slug, content)

  return {
    slug,
    title,
    topic,
    topicSlug: topicSlugFromName(topic),
    subtopic,
    subtopicSlug: subtopic ? slugifyParts(topic, subtopic) : null,
    relativePath,
    githubUrl: `https://github.com/${CONTENT_REPO_SLUG}/blob/${upstreamSha}/${relativePath}`,
    youtubeUrl: parseYoutubeUrl(content),
    leetcodeUrl: problemLinks.leetcodeUrl,
    gfgUrl: problemLinks.gfgUrl,
    companyTags: parseCompanyTags(content),
    timeComplexity: parseTimeComplexity(content),
    spaceComplexity: parseSpaceComplexity(content),
  }
}

function buildTopics(solutions: SolutionMeta[]): Topic[] {
  const topicMap = new Map<string, Topic>()

  for (const solution of solutions) {
    let topic = topicMap.get(solution.topicSlug)

    if (!topic) {
      topic = {
        name: solution.topic,
        slug: solution.topicSlug,
        solutionCount: 0,
        subtopics: [],
      }
      topicMap.set(solution.topicSlug, topic)
    }

    topic.solutionCount += 1

    if (solution.subtopic && solution.subtopicSlug) {
      let subtopic = topic.subtopics.find(
        (item) => item.slug === solution.subtopicSlug,
      )

      if (!subtopic) {
        subtopic = {
          name: solution.subtopic,
          slug: solution.subtopicSlug,
          solutionCount: 0,
        }
        topic.subtopics.push(subtopic)
      }

      subtopic.solutionCount += 1
    }
  }

  return [...topicMap.values()]
    .map((topic) => ({
      ...topic,
      subtopics: topic.subtopics.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function ensureUniqueSlugs(solutions: SolutionMeta[]): SolutionMeta[] {
  const slugCounts = new Map<string, number>()

  return solutions.map((solution) => {
    const count = slugCounts.get(solution.slug) ?? 0
    slugCounts.set(solution.slug, count + 1)

    if (count === 0) {
      return solution
    }

    const uniqueSlug = `${solution.slug}-${count + 1}`
    return { ...solution, slug: uniqueSlug }
  })
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

  return [...bySlug.values()].sort((a, b) => a.localeCompare(b))
}

function main() {
  const sourceDir = resolveSourceDir()
  const upstreamSha = getUpstreamSha(sourceDir)

  const generatedDir = path.join(process.cwd(), "generated")
  const solutionsDir = path.join(process.cwd(), GENERATED_SOLUTIONS_PATH)
  const indexPath = path.join(process.cwd(), GENERATED_INDEX_PATH)

  rmSync(solutionsDir, { recursive: true, force: true })
  mkdirSync(solutionsDir, { recursive: true })
  mkdirSync(generatedDir, { recursive: true })

  const topicDirs = readdirSync(sourceDir).filter((entry) => {
    const fullPath = path.join(sourceDir, entry)
    return statSync(fullPath).isDirectory() && isTopicDirectory(entry)
  })

  const cppFiles: Array<{ relativePath: string; absolutePath: string }> = []

  for (const topicDir of topicDirs) {
    cppFiles.push(...walkCppFiles(path.join(sourceDir, topicDir), topicDir))
  }

  console.log(`Found ${cppFiles.length} solution files`)

  let solutions = cppFiles.map(({ relativePath, absolutePath }) => {
    const content = readFileSync(absolutePath, "utf8")
    return parseSolutionFile(relativePath, content, upstreamSha)
  })

  solutions = ensureUniqueSlugs(solutions)

  for (const { absolutePath, relativePath } of cppFiles) {
    const solution = solutions.find((item) => item.relativePath === relativePath)
    if (!solution) {
      continue
    }

    cpSync(absolutePath, path.join(solutionsDir, `${solution.slug}.cpp`))
  }

  const companies = buildCompanyList(solutions)

  const index: ContentIndex = {
    upstreamSha,
    syncedAt: new Date().toISOString(),
    contentRepo: CONTENT_REPO_SLUG,
    originalRepo: ORIGINAL_REPO_SLUG,
    solutionCount: solutions.length,
    topicCount: new Set(solutions.map((solution) => solution.topicSlug)).size,
    companyCount: companies.length,
    topics: buildTopics(solutions),
    solutions: solutions.sort((a, b) => a.title.localeCompare(b.title)),
    companies,
  }

  writeFileSync(indexPath, JSON.stringify(index, null, 2))
  console.log(`Wrote ${index.solutionCount} solutions to ${indexPath}`)
}

main()
