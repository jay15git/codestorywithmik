import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  createDefaultTagState,
} from "@/lib/tags/migrate"
import { migrateStudyBagV1ToV2 } from "@/lib/storage/migrate"
import type { LegacyProgressEntry } from "@/lib/storage/types"
import {
  ALL_SAVED_LIST_ID,
  countSlugsForTagId,
  getSlugsForTagId,
  getSlugsWithAnyTag,
} from "@/lib/tags/lists"
import { STARRED_TAG_ID } from "@/lib/tags/constants"
import { matchesAnyTagFilter } from "@/lib/tags/filters"
import { createEmptyStudyBag } from "@/lib/storage/migrate"

describe("tag migrate", () => {
  it("migrates starred progress flags to tag assignments", () => {
    const bag = migrateStudyBagV1ToV2({
      version: 1,
      progress: {
        "two-sum": { solved: true, starred: true },
        "three-sum": { starred: true },
      } satisfies Record<string, LegacyProgressEntry>,
      language: null,
      viewMode: "grid",
    })

    assert.equal(bag.version, 2)
    assert.equal(bag.progress["two-sum"]?.solved, true)
    assert.equal(
      (bag.progress["two-sum"] as LegacyProgressEntry | undefined)?.starred,
      undefined,
    )
    assert.deepEqual(bag.tags.assignments["two-sum"], [STARRED_TAG_ID])
    assert.deepEqual(bag.tags.assignments["three-sum"], [STARRED_TAG_ID])
    assert.equal(bag.tags.definitions.length >= 1, true)
  })

  it("seeds default tags in empty state", () => {
    const state = createDefaultTagState()
    assert.equal(state.definitions.length, 1)
    assert.deepEqual(
      state.definitions.map((tag) => tag.id),
      [STARRED_TAG_ID],
    )
  })
})

describe("tag filters", () => {
  it("matches any selected tag id", () => {
    const assignments = {
      a: [STARRED_TAG_ID],
      b: [],
    }

    assert.equal(
      matchesAnyTagFilter(assignments, "a", [STARRED_TAG_ID]),
      true,
    )
    assert.equal(matchesAnyTagFilter(assignments, "b", [STARRED_TAG_ID]), false)
    assert.equal(matchesAnyTagFilter(assignments, "c", [STARRED_TAG_ID]), false)
  })

  it("matches all saved when virtual all id is selected", () => {
    const assignments = {
      a: [STARRED_TAG_ID],
      b: [],
    }

    assert.equal(
      matchesAnyTagFilter(assignments, "a", [ALL_SAVED_LIST_ID]),
      true,
    )
    assert.equal(
      matchesAnyTagFilter(assignments, "b", [ALL_SAVED_LIST_ID]),
      false,
    )
  })
})

describe("empty study bag v2", () => {
  it("creates version 2 with default tags", () => {
    const bag = createEmptyStudyBag()
    assert.equal(bag.version, 2)
    assert.equal(bag.tags.definitions.length, 1)
  })
})

describe("tag lists", () => {
  const assignments = {
    a: [STARRED_TAG_ID],
    b: [STARRED_TAG_ID],
  }

  it("collects all saved slugs", () => {
    assert.deepEqual(getSlugsWithAnyTag(assignments), ["a", "b"])
    assert.equal(countSlugsForTagId(assignments, ALL_SAVED_LIST_ID), 2)
  })

  it("filters slugs per tag id", () => {
    assert.deepEqual(getSlugsForTagId(assignments, STARRED_TAG_ID), ["a", "b"])
  })
})
