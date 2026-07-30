import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { parseWalkcccProblemDir } from "./walkccc-source"

describe("parseWalkcccProblemDir", () => {
  it("parses numbered problem folder names", () => {
    assert.deepEqual(parseWalkcccProblemDir("1. Two Sum"), {
      leetcodeId: 1,
      title: "Two Sum",
    })
    assert.deepEqual(parseWalkcccProblemDir("206. Reverse Linked List"), {
      leetcodeId: 206,
      title: "Reverse Linked List",
    })
  })

  it("returns null for invalid folder names", () => {
    assert.equal(parseWalkcccProblemDir("README"), null)
    assert.equal(parseWalkcccProblemDir(".git"), null)
  })
})
