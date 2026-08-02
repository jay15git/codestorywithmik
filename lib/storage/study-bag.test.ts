import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  buildStudyBagFromLegacyStorage,
  createEmptyStudyBag,
  hasLegacyStudyData,
  LEGACY_STORAGE_KEYS,
} from "./migrate"
import {
  getStudyBag,
  parseStudyBackup,
  patchStudyBag,
  replaceStudyBag,
  resetStudyBagForTests,
} from "./study-bag"
import { STARRED_TAG_ID } from "@/lib/tags/constants"

describe("study bag migrate", () => {
  it("builds bag from legacy localStorage keys", () => {
    const storage = new Map<string, string>([
      [
        LEGACY_STORAGE_KEYS.progress,
        JSON.stringify({ "two-sum": { solved: true } }),
      ],
      [
        LEGACY_STORAGE_KEYS.notes,
        JSON.stringify({
          "two-sum": { markdown: "note", updatedAt: "2026-01-01T00:00:00.000Z" },
        }),
      ],
      [LEGACY_STORAGE_KEYS.language, "python"],
      [LEGACY_STORAGE_KEYS.viewMode, "list"],
    ])

    const { bag, keysToRemove } = buildStudyBagFromLegacyStorage((key) =>
      storage.get(key) ?? null,
    )

    assert.equal(bag.version, 2)
    assert.equal(bag.progress["two-sum"]?.solved, true)
    assert.equal(bag.notes["two-sum"]?.markdown, "note")
    assert.equal(bag.language, "python")
    assert.equal(bag.viewMode, "list")
    assert.equal(keysToRemove.length, 4)
    assert.equal(hasLegacyStudyData((key) => storage.get(key) ?? null), true)
  })

  it("returns empty bag when no legacy keys exist", () => {
    const { bag, keysToRemove } = buildStudyBagFromLegacyStorage(() => null)
    assert.deepEqual(bag, createEmptyStudyBag())
    assert.deepEqual(keysToRemove, [])
  })
})

describe("study bag", () => {
  it("parses valid v2 backup json", () => {
    const bag = parseStudyBackup({
      version: 2,
      progress: { a: { solved: true } },
      notes: {},
      language: "java",
      viewMode: "list",
      tags: {
        definitions: [
          { id: STARRED_TAG_ID, name: "Starred", kind: "default" },
        ],
        assignments: { a: [STARRED_TAG_ID] },
      },
    })

    assert.equal(bag.progress.a?.solved, true)
    assert.equal(bag.language, "java")
    assert.equal(bag.viewMode, "list")
    assert.deepEqual(bag.tags.assignments.a, [STARRED_TAG_ID])
  })

  it("migrates v1 backup json to v2", () => {
    const bag = parseStudyBackup({
      version: 1,
      progress: { bar: { starred: true } },
      notes: {},
      language: null,
      viewMode: "grid",
    })

    assert.equal(bag.version, 2)
    assert.equal(bag.progress.bar, undefined)
    assert.deepEqual(bag.tags.assignments.bar, [STARRED_TAG_ID])
  })

  it("rejects unsupported backup versions", () => {
    assert.throws(() => parseStudyBackup({ version: 3 }), /Unsupported backup/)
    assert.throws(() => parseStudyBackup(null), /Unsupported backup/)
  })

  it("patches and replaces in memory", () => {
    resetStudyBagForTests()

    patchStudyBag({
      progress: { foo: { solved: true } },
      language: "python",
    })

    assert.equal(getStudyBag().progress.foo?.solved, true)
    assert.equal(getStudyBag().language, "python")

    replaceStudyBag({
      version: 2,
      progress: {},
      notes: {},
      language: null,
      viewMode: "grid",
      tags: {
        definitions: createEmptyStudyBag().tags.definitions,
        assignments: { bar: [STARRED_TAG_ID] },
      },
    })

    assert.deepEqual(getStudyBag().tags.assignments.bar, [STARRED_TAG_ID])
    assert.equal(getStudyBag().progress.foo, undefined)
  })
})
