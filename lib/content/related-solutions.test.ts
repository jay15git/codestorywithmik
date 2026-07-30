import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  getRelatedSolutions,
  scoreRelatedSolution,
} from "./related-solutions"
import type { SolutionMeta } from "./types"

function meta(
  partial: Pick<SolutionMeta, "slug" | "title"> & Partial<SolutionMeta>,
): SolutionMeta {
  return {
    leetcodeId: null,
    topic: "Array",
    topicSlug: "array",
    topicTags: ["Array"],
    subtopic: null,
    subtopicSlug: null,
    relativePath: "x",
    githubUrl: "https://example.com",
    youtubeUrl: null,
    leetcodeUrl: null,
    gfgUrl: null,
    companyTags: [],
    companyFrequencies: {},
    timeComplexity: null,
    spaceComplexity: null,
    difficulty: null,
    ...partial,
  }
}

describe("related solutions", () => {
  const current = meta({
    slug: "two-sum",
    title: "Two Sum",
    topicTags: ["Array", "Hash Table"],
    companyTags: ["Google", "Amazon"],
    difficulty: "Easy",
    leetcodeId: 1,
  })

  it("scores topic overlap higher than company", () => {
    const topicHeavy = meta({
      slug: "topic",
      title: "Topic",
      topicTags: ["Array", "Hash Table"],
      companyTags: [],
    })
    const companyHeavy = meta({
      slug: "company",
      title: "Company",
      topicTags: [],
      companyTags: ["Google", "Amazon"],
    })

    assert.ok(
      scoreRelatedSolution(current, topicHeavy) >
        scoreRelatedSolution(current, companyHeavy),
    )
  })

  it("ranks related and excludes self", () => {
    const related = getRelatedSolutions(current, [
      current,
      meta({
        slug: "best",
        title: "Best",
        topicTags: ["Array", "Hash Table"],
        companyTags: ["Google"],
        difficulty: "Easy",
        leetcodeId: 2,
      }),
      meta({
        slug: "weak",
        title: "Weak",
        topicTags: ["Array"],
        companyTags: [],
        leetcodeId: 3,
      }),
      meta({
        slug: "unrelated",
        title: "Unrelated",
        topicTags: ["Tree"],
        companyTags: ["Meta"],
        leetcodeId: 4,
      }),
    ])

    assert.deepEqual(
      related.map((solution) => solution.slug),
      ["best", "weak"],
    )
  })
})
