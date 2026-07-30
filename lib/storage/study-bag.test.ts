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
      [
        LEGACY_STORAGE_KEYS.srs,
        JSON.stringify({
          "two-sum": {
            dueAt: "2026-07-30",
            intervalDays: 1,
            ease: 2.5,
            repetitions: 0,
            updatedAt: "2026-07-30T00:00:00.000Z",
          },
        }),
      ],
      [LEGACY_STORAGE_KEYS.language, "python"],
      [LEGACY_STORAGE_KEYS.viewMode, "list"],
    ])

    const { bag, keysToRemove } = buildStudyBagFromLegacyStorage((key) =>
      storage.get(key) ?? null,
    )

    assert.equal(bag.version, 1)
    assert.equal(bag.progress["two-sum"]?.solved, true)
    assert.equal(bag.notes["two-sum"]?.markdown, "note")
    assert.equal(bag.srs["two-sum"]?.dueAt, "2026-07-30")
    assert.equal(bag.language, "python")
    assert.equal(bag.viewMode, "list")
    assert.equal(keysToRemove.length, 5)
    assert.equal(hasLegacyStudyData((key) => storage.get(key) ?? null), true)
  })

  it("returns empty bag when no legacy keys exist", () => {
    const { bag, keysToRemove } = buildStudyBagFromLegacyStorage(() => null)
    assert.deepEqual(bag, createEmptyStudyBag())
    assert.deepEqual(keysToRemove, [])
  })
})

describe("study bag", () => {
  it("parses valid backup json", () => {
    const bag = parseStudyBackup({
      version: 1,
      progress: { a: { solved: true } },
      notes: {},
      srs: {},
      language: "java",
      viewMode: "list",
    })

    assert.equal(bag.progress.a?.solved, true)
    assert.equal(bag.language, "java")
    assert.equal(bag.viewMode, "list")
  })

  it("rejects unsupported backup versions", () => {
    assert.throws(() => parseStudyBackup({ version: 2 }), /Unsupported backup/)
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
      version: 1,
      progress: { bar: { starred: true } },
      notes: {},
      srs: {},
      language: null,
      viewMode: "grid",
    })

    assert.equal(getStudyBag().progress.bar?.starred, true)
    assert.equal(getStudyBag().progress.foo, undefined)
  })
})
