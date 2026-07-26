export interface SolutionCode {
  cpp: string | null
  java: string | null
}

export interface SolutionMeta {
  slug: string
  title: string
  topic: string
  topicSlug: string
  subtopic: string | null
  subtopicSlug: string | null
  relativePath: string
  githubUrl: string
  youtubeUrl: string | null
  leetcodeUrl: string | null
  companyTags: string[]
  timeComplexity: string | null
  spaceComplexity: string | null
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

export interface SearchDocument {
  slug: string
  title: string
  topic: string
  subtopic: string | null
  companies: string
  leetcodeSlug: string | null
}
