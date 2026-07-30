import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { State } from "ts-fsrs"

import {
  coerceSrsCard,
  migrateLegacySrsCard,
} from "./migrate-legacy"
import {
  addUtcDays,
  applySrsRating,
  createInitialCard,
  isDueOnOrBefore,
  previewSrsRatings,
  toUtcDateKey,
} from "./schedule"

describe("srs schedule", () => {
  it("formats UTC date keys", () => {
    assert.equal(toUtcDateKey(new Date("2026-07-30T12:00:00Z")), "2026-07-30")
    assert.equal(addUtcDays("2026-07-30", 1), "2026-07-31")
    assert.equal(addUtcDays("2026-01-31", 1), "2026-02-01")
  })

  it("detects due cards", () => {
    assert.equal(isDueOnOrBefore("2026-07-29", "2026-07-30"), true)
    assert.equal(isDueOnOrBefore("2026-07-30", "2026-07-30"), true)
    assert.equal(isDueOnOrBefore("2026-07-31", "2026-07-30"), false)
  })

  it("enrolls first solve for tomorrow", () => {
    const card = createInitialCard("2026-07-30")
    assert.equal(card.dueAt, "2026-07-31")
    assert.equal(card.state, State.New)
  })

  it("again schedules sooner than good on a mature review card", () => {
    const mature = applySrsRating(
      createInitialCard("2026-07-01"),
      "good",
      new Date("2026-07-02T12:00:00Z"),
    )
    const reviewed = applySrsRating(
      mature,
      "good",
      new Date("2026-07-03T12:00:00Z"),
    )
    const again = applySrsRating(
      reviewed,
      "again",
      new Date("2026-07-30T12:00:00Z"),
    )
    const good = applySrsRating(
      reviewed,
      "good",
      new Date("2026-07-30T12:00:00Z"),
    )

    assert.ok(again.dueAt <= good.dueAt)
    assert.ok(again.lapses >= reviewed.lapses)
  })

  it("easy grows interval faster than good", () => {
    const mature = applySrsRating(
      createInitialCard("2026-07-01"),
      "good",
      new Date("2026-07-02T12:00:00Z"),
    )
    const reviewed = applySrsRating(
      mature,
      "good",
      new Date("2026-07-10T12:00:00Z"),
    )
    const now = new Date("2026-07-30T12:00:00Z")
    const good = applySrsRating(reviewed, "good", now)
    const easy = applySrsRating(reviewed, "easy", now)

    assert.ok(easy.dueAt > good.dueAt)
  })

  it("exposes interval previews for each rating", () => {
    const card = createInitialCard("2026-07-30")
    const previews = previewSrsRatings(card, new Date("2026-07-30T12:00:00Z"))

    assert.match(previews.again, /m|h|d|mo|now/)
    assert.match(previews.good, /m|h|d|mo|now/)
    assert.ok(previews.easy.length > 0)
  })
})

describe("legacy srs migration", () => {
  it("migrates legacy SM-2 card and preserves dueAt", () => {
    const migrated = migrateLegacySrsCard({
      dueAt: "2026-07-30",
      intervalDays: 6,
      ease: 2.5,
      repetitions: 2,
      updatedAt: "2026-07-24T00:00:00.000Z",
    })

    assert.equal(migrated.dueAt, "2026-07-30")
    assert.equal(migrated.reps, 2)
    assert.equal(migrated.state, State.Review)
    assert.equal(migrated.scheduled_days, 6)
    assert.equal(migrated.stability, 6)
    assert.equal(
      coerceSrsCard({
        dueAt: "2026-07-30",
        intervalDays: 1,
        ease: 2.5,
        repetitions: 0,
        updatedAt: "2026-07-30T00:00:00.000Z",
      })?.dueAt,
      "2026-07-30",
    )
  })
})
