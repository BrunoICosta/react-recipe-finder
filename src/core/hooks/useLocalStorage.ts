import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'

type Listener = () => void
type SetValue<T> = (value: T | ((previous: T) => T)) => void

export interface UseLocalStorageOptions<T> {
  /** Validates/coerces the parsed JSON. Throwing makes the hook fall back to the initial value. */
  parse?: (value: unknown) => T
}

const listeners = new Map<string, Set<Listener>>()
/** Used when localStorage is unavailable (private mode, quota exceeded, disabled cookies). */
const memoryFallback = new Map<string, string>()

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memoryFallback.get(key) ?? null
  } catch {
    return memoryFallback.get(key) ?? null
  }
}

function writeRaw(key: string, raw: string | null): void {
  try {
    if (raw === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, raw)
    memoryFallback.delete(key)
  } catch {
    if (raw === null) memoryFallback.delete(key)
    else memoryFallback.set(key, raw)
  }
  listeners.get(key)?.forEach((listener) => listener())
}

function subscribe(key: string, listener: Listener): () => void {
  const keyListeners = listeners.get(key) ?? new Set<Listener>()
  keyListeners.add(listener)
  listeners.set(key, keyListeners)

  // Keeps several tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener()
  }
  window.addEventListener('storage', onStorage)

  return () => {
    keyListeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function decode<T>(raw: string | null, fallback: T, parse?: (value: unknown) => T): T {
  if (raw === null) return fallback
  try {
    const value: unknown = JSON.parse(raw)
    return parse ? parse(value) : (value as T)
  } catch {
    return fallback
  }
}

/**
 * Persists JSON-serialisable state in localStorage. Every component using the same key
 * shares the value, and changes made in other tabs are picked up automatically.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
): [T, SetValue<T>, () => void] {
  const { parse } = options
  // Freeze the first initial value so inline literals do not trigger re-decoding.
  const [fallback] = useState(initialValue)

  const raw = useSyncExternalStore(
    useCallback((listener: Listener) => subscribe(key, listener), [key]),
    () => readRaw(key),
    () => null,
  )

  const value = useMemo(() => decode(raw, fallback, parse), [raw, fallback, parse])

  const setValue = useCallback<SetValue<T>>(
    (next) => {
      const previous = decode(readRaw(key), fallback, parse)
      const resolved = next instanceof Function ? next(previous) : next
      writeRaw(key, JSON.stringify(resolved))
    },
    [key, fallback, parse],
  )

  const remove = useCallback(() => writeRaw(key, null), [key])

  return [value, setValue, remove]
}
