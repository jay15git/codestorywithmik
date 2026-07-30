import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  parseLanguageParam,
  pickPreferredLanguage,
} from "../preferences/language"

describe("language preference", () => {
  it("parses known language params", () => {
    assert.equal(parseLanguageParam("python"), "python")
    assert.equal(parseLanguageParam("PYTHON"), "python")
    assert.equal(parseLanguageParam("ruby"), null)
  })

  it("prefers URL lang over stored preference", () => {
    assert.equal(
      pickPreferredLanguage(["cpp", "python", "java"], "java", "python"),
      "python",
    )
  })

  it("falls back to preference then first available", () => {
    assert.equal(
      pickPreferredLanguage(["cpp", "python"], "python", null),
      "python",
    )
    assert.equal(
      pickPreferredLanguage(["cpp", "python"], "sql", null),
      "cpp",
    )
  })
})
