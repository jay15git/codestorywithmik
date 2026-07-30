import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  addUtcDays,
  applySrsRating,
  createInitialCard,
  isDueOnOrBefore,
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

  it("schedules first good review for tomorrow", () => {
    const next = applySrsRating(null, "good", "2026-07-30")
    assert.equal(next.dueAt, "2026-07-31")
    assert.equal(next.intervalDays, 1)
    assert.equal(next.repetitions, 1)
  })

  it("again resets to due today", () => {
    const card = createInitialCard("2026-07-30", 3)
    const next = applySrsRating(card, "again", "2026-07-30")
    assert.equal(next.dueAt, "2026-07-30")
    assert.equal(next.repetitions, 0)
    assert.ok(next.ease < card.ease)
  })

  it("easy grows interval faster than good", () => {
    const mature = {
      dueAt: "2026-07-30",
      intervalDays: 10,
      ease: 2.5,
      repetitions: 3,
      updatedAt: "2026-07-20T00:00:00.000Z",
    }
    const good = applySrsRating(mature, "good", "2026-07-30")
    const easy = applySrsRating(mature, "easy", "2026-07-30")
    assert.ok(easy.intervalDays > good.intervalDays)
  })
})
