import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  buildSolutionHref,
  findNeighbors,
  parseSolutionNavParams,
} from "./solution-nav"
import type { SolutionMeta } from "./types"

function meta(slug: string, title = slug): SolutionMeta {
  return {
    slug,
    title,
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
  }
}

describe("solution nav", () => {
  it("parses topic and company nav context", () => {
    assert.deepEqual(
      parseSolutionNavParams({
        from: "topic",
        topic: "array",
        difficulty: "Easy",
        status: "unsolved",
      }),
      {
        from: "topic",
        topicSlug: "array",
        companySlug: null,
        patternSlug: null,
        planSlug: null,
        difficulty: "Easy",
        prep: null,
        status: "unsolved",
        lang: null,
      },
    )

    assert.equal(
      parseSolutionNavParams({ from: "topic" }),
      null,
    )
  })

  it("parses pattern nav context", () => {
    assert.deepEqual(
      parseSolutionNavParams({
        from: "pattern",
        pattern: "two-pointers",
        status: "starred",
      }),
      {
        from: "pattern",
        topicSlug: null,
        companySlug: null,
        patternSlug: "two-pointers",
        planSlug: null,
        difficulty: null,
        prep: null,
        status: "starred",
        lang: null,
      },
    )
  })

  it("parses plan nav context", () => {
    assert.deepEqual(
      parseSolutionNavParams({
        from: "plan",
        plan: "blind-75",
        status: "unsolved",
      }),
      {
        from: "plan",
        topicSlug: null,
        companySlug: null,
        patternSlug: null,
        planSlug: "blind-75",
        difficulty: null,
        prep: null,
        status: "unsolved",
        lang: null,
      },
    )
  })

  it("builds solution href with nav query", () => {
    assert.equal(
      buildSolutionHref("two-sum", {
        from: "company",
        companySlug: "google",
        prep: "top50",
        status: "starred",
      }),
      "/solutions/two-sum?from=company&company=google&prep=top50&status=starred",
    )
  })

  it("finds prev and next neighbors", () => {
    const solutions = [meta("a"), meta("b"), meta("c")]
    assert.deepEqual(findNeighbors(solutions, "b"), {
      prev: solutions[0],
      next: solutions[2],
    })
    assert.deepEqual(findNeighbors(solutions, "a"), {
      prev: null,
      next: solutions[1],
    })
    assert.deepEqual(findNeighbors(solutions, "missing"), {
      prev: null,
      next: null,
    })
  })
})
