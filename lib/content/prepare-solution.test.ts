import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { getSolutionMeta } from "./get-content"
import {
  getShikiLanguage,
  getSolutionCacheVersion,
  getSolutionLanguageFilename,
  prepareSolution,
} from "./prepare-solution"
import type { SolutionLanguage } from "./solution-languages"
import type { SolutionMeta } from "./types"

const meta: SolutionMeta = {
  slug: "example-problem",
  title: "Example Problem",
  leetcodeId: 1,
  topic: "Array",
  topicSlug: "array",
  topicTags: ["Array"],
  subtopic: null,
  subtopicSlug: null,
  relativePath: "solutions/1. Example Problem/1.cpp",
  githubUrl: "https://example.com/example-problem",
  youtubeUrl: null,
  leetcodeUrl: "https://leetcode.com/problems/example-problem/",
  gfgUrl: null,
  companyTags: [],
  timeComplexity: null,
  spaceComplexity: null,
  difficulty: "Easy",
}

describe("solution catalog", () => {
  it("looks up known slugs without loading solution files", () => {
    assert.equal(getSolutionMeta("contains-duplicate")?.title, "Contains Duplicate")
    assert.equal(getSolutionMeta("missing-solution"), undefined)
  })
})

describe("solution preparation", () => {
  it("maps every supported language to its generated filename", () => {
    assert.deepEqual(
      ["cpp", "java", "python", "sql", "typescript"].map((language) =>
        getSolutionLanguageFilename(
          "two-sum",
          language as SolutionLanguage,
        ),
      ),
      [
        "two-sum.cpp",
        "two-sum.java",
        "two-sum.py",
        "two-sum.sql",
        "two-sum.ts",
      ],
    )
  })

  it("versions persistent cache entries with upstream content SHA", () => {
    assert.equal(getSolutionCacheVersion("abc123"), "solutions:abc123")
    assert.notEqual(
      getSolutionCacheVersion("abc123"),
      getSolutionCacheVersion("def456"),
    )
  })

  it("loads and highlights every available language", async () => {
    const sources: Partial<Record<SolutionLanguage, string>> = {
      cpp: "  int main() {}  ",
      python: "print('ok')",
    }
    const highlighted: SolutionLanguage[] = []

    const result = await prepareSolution(
      meta,
      async (_slug, language) => sources[language] ?? null,
      async (code, language) => {
        highlighted.push(language)
        return `<pre data-language="${getShikiLanguage(language)}">${code}</pre>`
      },
    )

    assert.ok(result)
    assert.equal(result.rawContent, "int main() {}")
    assert.equal(result.code.cpp, "int main() {}")
    assert.equal(result.code.java, null)
    assert.deepEqual(highlighted, ["cpp", "python"])
    assert.match(result.highlighted.python ?? "", /data-language="python"/)
  })

  it("returns undefined when no solution file exists", async () => {
    const result = await prepareSolution(
      meta,
      async () => null,
      async () => {
        assert.fail("missing code must not be highlighted")
      },
    )

    assert.equal(result, undefined)
  })
})
