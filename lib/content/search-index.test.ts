import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  buildSearchIndex,
  matchesHaystack,
  searchIndex,
  tokenizeQuery,
} from "./search-index"
import type { SolutionMeta, Topic } from "./types"

const sampleSolutions: SolutionMeta[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    leetcodeId: 1,
    topic: "Array",
    topicSlug: "array",
    topicTags: ["Array", "Hash Table"],
    subtopic: null,
    subtopicSlug: null,
    relativePath: "solutions/1. Two Sum/1.cpp",
    githubUrl: "https://github.com/example/two-sum",
    youtubeUrl: null,
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    gfgUrl: null,
    companyTags: ["Amazon", "Google"],
    timeComplexity: null,
    spaceComplexity: null,
    difficulty: "Easy",
  },
  {
    slug: "bfs-traversal",
    title: "BFS Traversal",
    leetcodeId: 2,
    topic: "Graph",
    topicSlug: "graph",
    topicTags: ["Graph", "Breadth-First Search"],
    subtopic: null,
    subtopicSlug: null,
    relativePath: "solutions/2. BFS Traversal/2.cpp",
    githubUrl: "https://github.com/example/bfs",
    youtubeUrl: null,
    leetcodeUrl: null,
    gfgUrl: null,
    companyTags: ["Microsoft"],
    timeComplexity: null,
    spaceComplexity: null,
    difficulty: "Medium",
  },
]

const sampleTopics: Topic[] = [
  {
    name: "Array",
    slug: "array",
    solutionCount: 1,
    subtopics: [],
  },
  {
    name: "Graph",
    slug: "graph",
    solutionCount: 1,
    subtopics: [],
  },
]

describe("search-index", () => {
  it("tokenizeQuery splits on whitespace", () => {
    assert.deepEqual(tokenizeQuery("  two sum "), ["two", "sum"])
  })

  it("matchesHaystack requires all tokens", () => {
    assert.equal(matchesHaystack("two sum amazon", ["two", "sum"]), true)
    assert.equal(matchesHaystack("two sum amazon", ["two", "graph"]), false)
  })

  it("buildSearchIndex creates grouped haystacks", () => {
    const index = buildSearchIndex(sampleSolutions, sampleTopics)

    assert.equal(index.problems.length, 2)
    assert.equal(index.companies.length, 3)
    assert.equal(index.topics.length, 2)
    assert.match(index.problems[0].haystack, /amazon/)
    assert.equal(index.companies.find((c) => c.slug === "amazon")?.count, 1)
  })

  it("searchIndex returns grouped results with token AND", () => {
    const index = buildSearchIndex(sampleSolutions, sampleTopics)
    const results = searchIndex(index, "amazon")

    assert.equal(results.companies.length, 1)
    assert.equal(results.companies[0]?.name, "Amazon")

    const problemResults = searchIndex(index, "two amazon")
    assert.equal(problemResults.problems.length, 1)
    assert.equal(problemResults.problems[0]?.title, "Two Sum")
  })

  it("searchIndex ranks title prefix matches first", () => {
    const index = buildSearchIndex(sampleSolutions, sampleTopics)
    const results = searchIndex(index, "bfs")

    assert.equal(results.problems[0]?.title, "BFS Traversal")
  })

  it("searchIndex returns recent problems when query empty", () => {
    const index = buildSearchIndex(sampleSolutions, sampleTopics)
    const results = searchIndex(index, "")

    assert.equal(results.companies.length, 0)
    assert.equal(results.topics.length, 0)
    assert.equal(results.problems.length, 2)
  })
})
