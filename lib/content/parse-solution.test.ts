import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  parseSpaceComplexity,
  parseTimeComplexity,
  splitCodeBlocks,
} from "./parse-solution"

describe("parse-solution complexity", () => {
  it("parses time complexity with division in expression", () => {
    const content = `/*
T.C : O(n*W)
S.C : O(n)
*/`

    assert.equal(parseTimeComplexity(content), "O(n*W)")
    assert.equal(parseSpaceComplexity(content), "O(n)")
  })

  it("strips trailing comment markers from complexity values", () => {
    const content = `T.C : O(n log n) */`

    assert.equal(parseTimeComplexity(content), "O(n log n)")
  })
})

describe("splitCodeBlocks", () => {
  it("splits cpp and java sections from bare markers", () => {
    const content = `***** C++ *****
int main() {}
***** JAVA *****
class Main {}`

    const blocks = splitCodeBlocks(content)

    assert.match(blocks.cpp ?? "", /int main/)
    assert.match(blocks.java ?? "", /class Main/)
  })
})
