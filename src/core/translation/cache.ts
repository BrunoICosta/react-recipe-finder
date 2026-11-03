/**
 * Persistent cache of machine translations, so a recipe is translated once per browser.
 * Entries are keyed by a hash of the source text and the target language.
 */
const STORAGE_KEY = 'receitario:translations:v1'
const MAX_ENTRIES = 1500

type Entries = Record<string, string>

let memory: Map<string, string> | null = null

/** FNV-1a 32-bit hash; the text length is added to the key to make collisions negligible. */
function hash(text: string): string {
  let value = 0x811c9dc5
  for (let index = 0; index < text.length; index++) {
    value ^= text.charCodeAt(index)
    value = Math.imul(value, 0x01000193)
  }
  return (value >>> 0).toString(36)
}

export function cacheKey(text: string, target: string): string {
  return `${target}:${text.length}:${hash(text)}`
}

function load(): Map<string, string> {
  if (memory) return memory
  memory = new Map()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : {}
    if (parsed && typeof parsed === 'object') {
      for (const [key, value] of Object.entries(parsed as Entries)) {
        if (typeof value === 'string') memory.set(key, value)
      }
    }
  } catch {
    // Corrupted or unavailable storage: start with an empty cache.
  }
  return memory
}

function persist(entries: Map<string, string>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)))
  } catch {
    // Quota exceeded or storage disabled: keep the in-memory cache only.
  }
}

export function readCached(text: string, target: string): string | undefined {
  return load().get(cacheKey(text, target))
}

export function writeCached(pairs: [source: string, translated: string][], target: string): void {
  if (pairs.length === 0) return
  const entries = load()
  for (const [source, translated] of pairs) {
    const key = cacheKey(source, target)
    entries.delete(key) // re-insert so the newest entries survive trimming
    entries.set(key, translated)
  }
  // Maps keep insertion order: drop the oldest entries first.
  const excess = entries.size - MAX_ENTRIES
  if (excess > 0) {
    let removed = 0
    for (const key of entries.keys()) {
      if (removed++ >= excess) break
      entries.delete(key)
    }
  }
  persist(entries)
}

/** Exposed for tests. */
export function resetTranslationCache(): void {
  memory = null
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
