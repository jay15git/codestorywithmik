import assert from "node:assert/strict"
import { beforeEach, describe, it } from "node:test"

import {
  CUELUME_ENABLED_KEY,
  readCuelumeEnabled,
  writeCuelumeEnabled,
} from "./cuelume"

function installMemoryStorage() {
  const store = new Map<string, string>()

  const storage = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
    removeItem(key: string) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
    key() {
      return null
    },
    get length() {
      return store.size
    },
  } as Storage

  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storage,
  })
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: globalThis,
  })

  return storage
}

describe("cuelume preference", () => {
  beforeEach(() => {
    installMemoryStorage().clear()
  })

  it("defaults to enabled when unset", () => {
    assert.equal(readCuelumeEnabled(), true)
  })

  it("reads and writes the preference", () => {
    writeCuelumeEnabled(false)
    assert.equal(window.localStorage.getItem(CUELUME_ENABLED_KEY), "false")
    assert.equal(readCuelumeEnabled(), false)

    writeCuelumeEnabled(true)
    assert.equal(readCuelumeEnabled(), true)
  })
})
