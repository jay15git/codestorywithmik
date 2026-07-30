import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  getSolutionsForStudyPlan,
  getStudyPlan,
  getStudyPlanGroupsWithSolutions,
  studyPlanIdCount,
} from "./study-plans"
import type { SolutionMeta } from "./types"

function meta(
  partial: Pick<SolutionMeta, "slug" | "title" | "leetcodeId"> &
    Partial<SolutionMeta>,
): SolutionMeta {
  return {
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

describe("study plans", () => {
  it("looks up plan by slug", () => {
    assert.equal(getStudyPlan("blind-75")?.name, "Blind 75")
    assert.equal(getStudyPlan("neetcode-150")?.name, "NeetCode 150")
    assert.equal(getStudyPlan("neetcode-250")?.name, "NeetCode 250")
    assert.equal(getStudyPlan("missing"), undefined)
  })

  it("counts curated ids", () => {
    const blind = getStudyPlan("blind-75")!
    const neet = getStudyPlan("neetcode-150")!
    const neet250 = getStudyPlan("neetcode-250")!
    assert.equal(studyPlanIdCount(blind), 75)
    assert.equal(studyPlanIdCount(neet), 150)
    assert.equal(studyPlanIdCount(neet250), 250)
  })

  it("resolves solutions in plan order and skips missing ids", () => {
    const plan = getStudyPlan("blind-75")!
    const solutions = [
      meta({ slug: "two-sum", title: "Two Sum", leetcodeId: 1 }),
      meta({
        slug: "contains-duplicate",
        title: "Contains Duplicate",
        leetcodeId: 217,
      }),
      meta({ slug: "unrelated", title: "Unrelated", leetcodeId: 9999 }),
    ]

    const ordered = getSolutionsForStudyPlan(plan, solutions)
    assert.deepEqual(
      ordered.map((solution) => solution.slug),
      ["contains-duplicate", "two-sum"],
    )

    const groups = getStudyPlanGroupsWithSolutions(plan, solutions)
    const arrays = groups.find((group) => group.name === "Arrays & Hashing")
    assert.deepEqual(
      arrays?.solutions.map((solution) => solution.leetcodeId),
      [217, 1],
    )
  })
})
