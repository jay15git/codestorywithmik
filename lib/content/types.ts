export interface SolutionCode {
  cpp: string | null
  java: string | null
  python: string | null
  sql: string | null
  typescript: string | null
}

export type Difficulty = "Easy" | "Medium" | "Hard"

export interface SolutionMeta {
  slug: string
  title: string
  leetcodeId: number | null
  topic: string
  topicSlug: string
  topicTags: string[]
  subtopic: string | null
  subtopicSlug: string | null
  relativePath: string
  githubUrl: string
  youtubeUrl: string | null
  leetcodeUrl: string | null
  gfgUrl: string | null
  companyTags: string[]
  timeComplexity: string | null
  spaceComplexity: string | null
  difficulty: Difficulty | null
}

export interface Solution extends SolutionMeta {
  code: SolutionCode
  rawContent: string
}

export interface Topic {
  name: string
  slug: string
  solutionCount: number
  subtopics: Subtopic[]
}

export interface Subtopic {
  name: string
  slug: string
  solutionCount: number
}

export interface ContentIndex {
  upstreamSha: string
  syncedAt: string
  contentRepo: string
  originalRepo: string
  solutionCount: number
  topicCount: number
  companyCount: number
  topics: Topic[]
  solutions: SolutionMeta[]
  companies: string[]
}

export interface ProblemSearchItem {
  slug: string
  title: string
  topic: string
  subtopic: string | null
  difficulty: Difficulty | null
  haystack: string
}

export interface CompanySearchItem {
  name: string
  slug: string
  count: number
  haystack: string
}

export interface TopicSearchItem {
  name: string
  slug: string
  count: number
  haystack: string
}

export interface SearchIndex {
  problems: ProblemSearchItem[]
  companies: CompanySearchItem[]
  topics: TopicSearchItem[]
}
