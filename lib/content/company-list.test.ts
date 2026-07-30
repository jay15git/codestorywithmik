import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  buildCompanyList,
  sortCompanies,
} from "./company-list"
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

describe("company-list", () => {
  it("sorts by frequency score", () => {
    const solutions = [
      meta({
        slug: "a",
        title: "A",
        companyTags: ["Google"],
        companyFrequencies: { Google: 10 },
      }),
      meta({
        slug: "b",
        title: "B",
        companyTags: ["Amazon"],
        companyFrequencies: { Amazon: 90 },
      }),
      meta({
        slug: "c",
        title: "C",
        companyTags: ["Amazon"],
        companyFrequencies: { Amazon: 20 },
      }),
    ]

    const list = buildCompanyList(solutions, ["Amazon", "Google"])
    const sorted = sortCompanies(list, "frequency")
    assert.equal(sorted[0]?.name, "Amazon")
    assert.equal(sorted[0]?.frequencyScore, 110)
    assert.equal(sorted[1]?.name, "Google")
  })
})
