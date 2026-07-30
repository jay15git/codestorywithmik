import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, describe, it } from "node:test"

import { buildLeetcodeCompanyTagIndex } from "./leetcode-company-tags"

const tempDirs: string[] = []

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true })
  }
})

describe("buildLeetcodeCompanyTagIndex", () => {
  it("captures company frequency percents", () => {
    const root = mkdtempSync(path.join(tmpdir(), "company-tags-"))
    tempDirs.push(root)
    const companyDir = path.join(root, "google")
    mkdirSync(companyDir)
    writeFileSync(
      path.join(companyDir, "all.csv"),
      [
        "ID,URL,Title,Difficulty,Acceptance %,Frequency %",
        "1,https://leetcode.com/problems/two-sum,Two Sum,Easy,50.0%,88.5%",
        "2,https://leetcode.com/problems/add-two-numbers,Add Two Numbers,Medium,40.0%,12.0%",
        "",
      ].join("\n"),
    )

    const index = buildLeetcodeCompanyTagIndex(root)
    assert.equal(index.get("two-sum")?.Google, 88.5)
    assert.equal(index.get("add-two-numbers")?.Google, 12)
  })
})
