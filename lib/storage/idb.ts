const DB_NAME = "study-db"
const DB_VERSION = 1
const STORE_NAME = "kv"
export const STUDY_BAG_KEY = "bag"

let dbPromise: Promise<IDBDatabase> | null = null

function openStudyDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available"))
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(request.error ?? new Error("Failed to open IndexedDB"))
      }

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }

      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  return dbPromise
}

export async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openStudyDb()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(key)

    request.onerror = () => {
      reject(request.error ?? new Error(`Failed to read ${key}`))
    }

    request.onsuccess = () => {
      resolve((request.result as T | undefined) ?? null)
    }
  })
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  const db = await openStudyDb()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(value, key)

    request.onerror = () => {
      reject(request.error ?? new Error(`Failed to write ${key}`))
    }

    request.onsuccess = () => {
      resolve()
    }
  })
}
