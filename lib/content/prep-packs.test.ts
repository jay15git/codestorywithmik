import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { applyPrepPack, parsePrepPack } from "./prep-packs"
import type { SolutionMeta } from "./types"

function meta(
  partial: Pick<SolutionMeta, "slug" | "title"> &
    Partial<SolutionMeta>,
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
    companyTags: ["Google"],
    companyFrequencies: {},
    timeComplexity: null,
    spaceComplexity: null,
    difficulty: null,
    ...partial,
  }
}

describe("prep packs", () => {
  it("parses known packs only", () => {
    assert.equal(parsePrepPack("top50"), "top50")
    assert.equal(parsePrepPack("top25"), "top25")
    assert.equal(parsePrepPack("nope"), null)
  })

  it("ranks by company frequency then difficulty", () => {
    const solutions = [
      meta({
        slug: "low",
        title: "Low",
        companyFrequencies: { Google: 10 },
        difficulty: "Easy",
        leetcodeId: 1,
      }),
      meta({
        slug: "high",
        title: "High",
        companyFrequencies: { Google: 90 },
        difficulty: "Hard",
        leetcodeId: 2,
      }),
      meta({
        slug: "mid",
        title: "Mid",
        companyFrequencies: { Google: 50 },
        difficulty: "Medium",
        leetcodeId: 3,
      }),
    ]

    const pack = applyPrepPack(solutions, "Google", "top25")
    assert.deepEqual(
      pack.map((solution) => solution.slug),
      ["high", "mid", "low"],
    )
  })

  it("limits to pack size", () => {
    const solutions = Array.from({ length: 30 }, (_, index) =>
      meta({
        slug: `p-${index}`,
        title: `P ${index}`,
        companyFrequencies: { Google: 100 - index },
        leetcodeId: index,
      }),
    )

    const pack = applyPrepPack(solutions, "Google", "top25")
    assert.equal(pack.length, 25)
    assert.equal(pack[0]?.slug, "p-0")
  })
})
