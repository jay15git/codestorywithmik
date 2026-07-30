import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  comparePatternOrder,
  getPattern,
  getSolutionsForPattern,
  solutionMatchesPattern,
} from "./patterns"
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
    timeComplexity: null,
    spaceComplexity: null,
    difficulty: null,
    ...partial,
  }
}

describe("patterns", () => {
  it("looks up pattern by slug", () => {
    assert.equal(getPattern("two-pointers")?.name, "Two Pointers")
    assert.equal(getPattern("missing"), undefined)
  })

  it("matches by topic tags", () => {
    const pattern = getPattern("sliding-window")!
    assert.equal(
      solutionMatchesPattern(
        meta({
          slug: "a",
          title: "A",
          topicTags: ["Sliding Window", "Array"],
        }),
        pattern,
      ),
      true,
    )
    assert.equal(
      solutionMatchesPattern(
        meta({ slug: "b", title: "B", topicTags: ["Tree"] }),
        pattern,
      ),
      false,
    )
  })

  it("orders Easy then Medium then Hard", () => {
    const pattern = getPattern("two-pointers")!
    const ordered = getSolutionsForPattern(pattern, [
      meta({
        slug: "hard",
        title: "Hard",
        topicTags: ["Two Pointers"],
        difficulty: "Hard",
        leetcodeId: 1,
      }),
      meta({
        slug: "easy",
        title: "Easy",
        topicTags: ["Two Pointers"],
        difficulty: "Easy",
        leetcodeId: 3,
      }),
      meta({
        slug: "med",
        title: "Med",
        topicTags: ["Two Pointers"],
        difficulty: "Medium",
        leetcodeId: 2,
      }),
    ])

    assert.deepEqual(
      ordered.map((solution) => solution.slug),
      ["easy", "med", "hard"],
    )
  })

  it("comparePatternOrder puts unknown difficulty last", () => {
    assert.ok(
      comparePatternOrder(
        meta({ slug: "a", title: "A", difficulty: "Easy" }),
        meta({ slug: "b", title: "B", difficulty: null }),
      ) < 0,
    )
  })
})
