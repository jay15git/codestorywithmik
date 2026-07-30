import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  fuzzySubsequence,
  fuzzyTitleScore,
  parseSearchQuery,
} from "./search-query"

describe("search-query", () => {
  it("parses leetcode id from #121", () => {
    assert.deepEqual(parseSearchQuery("#121"), {
      tokens: [],
      raw: "#121",
      leetcodeId: 121,
      difficulty: null,
      company: null,
    })
  })

  it("parses difficulty and company tokens", () => {
    const parsed = parseSearchQuery("easy @google two")
    assert.equal(parsed.difficulty, "Easy")
    assert.equal(parsed.company, "google")
    assert.deepEqual(parsed.tokens, ["two"])
  })

  it("scores fuzzy title matches", () => {
    assert.equal(fuzzySubsequence("two sum", "twsm"), true)
    assert.ok(fuzzyTitleScore("Two Sum", ["twsm"]) > 0)
    assert.equal(fuzzyTitleScore("Two Sum", ["zzzz"]), -1)
  })
})
