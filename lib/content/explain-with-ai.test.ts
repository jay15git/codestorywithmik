import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  AI_PROMPT_MAX_CHARS,
  buildAiProviderUrl,
  buildExplainPrompt,
} from "./explain-with-ai"

describe("explain-with-ai", () => {
  it("builds a detailed prompt with metadata and code", () => {
    const prompt = buildExplainPrompt({
      title: "Two Sum",
      language: "cpp",
      code: "int main() {}",
      topic: "Array",
      difficulty: "Easy",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    })

    assert.match(prompt, /Explain this coding interview solution/)
    assert.match(prompt, /Problem: Two Sum/)
    assert.match(prompt, /Topic: Array/)
    assert.match(prompt, /Difficulty: Easy/)
    assert.match(prompt, /Language: C\+\+/)
    assert.match(prompt, /Time complexity: O\(n\)/)
    assert.match(prompt, /Space complexity: O\(n\)/)
    assert.match(prompt, /Practice link: https:\/\/leetcode\.com\/problems\/two-sum\//)
    assert.match(prompt, /```cpp/)
    assert.match(prompt, /int main\(\) \{\}/)
    assert.match(prompt, /Step-by-step walkthrough/)
  })

  it("truncates long code to stay within URL-safe prompt length", () => {
    const code = "a".repeat(5000)
    const prompt = buildExplainPrompt({
      title: "Huge",
      language: "python",
      code,
    })

    assert.ok(prompt.length <= AI_PROMPT_MAX_CHARS)
    assert.match(prompt, /truncated for URL length/)
  })

  it("builds provider deep links with encoded prompt", () => {
    const prompt = "Explain Two Sum"
    const chatgpt = buildAiProviderUrl("chatgpt", prompt)
    const claude = buildAiProviderUrl("claude", prompt)
    const gemini = buildAiProviderUrl("gemini", prompt)

    assert.equal(
      chatgpt,
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
    )
    assert.equal(
      claude,
      `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
    )
    assert.equal(
      gemini,
      `https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`,
    )
  })
})
