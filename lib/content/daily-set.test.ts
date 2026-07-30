import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  getProblemOfTheDay,
  getWeeklySet,
  hashString,
  toDateKey,
  toWeekKey,
} from "./daily-set"
import type { SolutionMeta } from "./types"

function meta(slug: string, id: number): SolutionMeta {
  return {
    slug,
    title: slug,
    leetcodeId: id,
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
    difficulty: "Easy",
  }
}

describe("daily-set", () => {
  const solutions = Array.from({ length: 20 }, (_, index) =>
    meta(`p-${index}`, index + 1),
  )

  it("hashes stably", () => {
    assert.equal(hashString("daily:2026-07-30"), hashString("daily:2026-07-30"))
    assert.notEqual(hashString("a"), hashString("b"))
  })

  it("picks same potd for same UTC day", () => {
    const date = new Date("2026-07-30T12:00:00Z")
    assert.equal(toDateKey(date), "2026-07-30")
    const a = getProblemOfTheDay(solutions, date)
    const b = getProblemOfTheDay(solutions, new Date("2026-07-30T23:00:00Z"))
    assert.equal(a?.slug, b?.slug)
  })

  it("returns weekly set of unique problems", () => {
    const date = new Date("2026-07-30T12:00:00Z")
    assert.match(toWeekKey(date), /^2026-W\d{2}$/)
    const weekly = getWeeklySet(solutions, date, 7)
    assert.equal(weekly.length, 7)
    assert.equal(new Set(weekly.map((item) => item.slug)).size, 7)
  })
})
