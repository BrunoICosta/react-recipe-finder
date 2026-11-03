import { readCached, writeCached } from './cache'
import {
  browserProvider,
  isBrowserTranslatorSupported,
  myMemoryProvider,
  TranslationLimitError,
  type TranslationProvider,
} from './providers'

export { TranslationLimitError } from './providers'

/**
 * Machine translation of TheMealDB content (always English) into the UI language.
 * Cached results are returned without any request; the rest goes to the browser's
 * on-device Translator when available, otherwise to MyMemory.
 */
export async function translateTexts(
  texts: readonly string[],
  target: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const result = texts.map((text) => (text.trim() ? readCached(text, target) : text))
  const missing = [...new Set(texts.filter((_, index) => result[index] === undefined))]

  if (missing.length > 0) {
    const translated = await translateWithProviders(missing, target, signal)
    const byText = new Map(missing.map((text, index) => [text, translated[index]]))
    writeCached([...byText], target)
    texts.forEach((text, index) => {
      if (result[index] === undefined) result[index] = byText.get(text) ?? text
    })
  }
  return result as string[]
}

async function translateWithProviders(
  texts: string[],
  target: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const providers: TranslationProvider[] = isBrowserTranslatorSupported()
    ? [browserProvider, myMemoryProvider]
    : [myMemoryProvider]

  let lastError: unknown = new Error('No translation provider')
  for (const provider of providers) {
    try {
      return await provider.translate(texts, target, signal)
    } catch (error) {
      if (signal?.aborted) throw error
      lastError = error
    }
  }
  throw lastError
}

export function isLimitError(error: unknown): boolean {
  return error instanceof TranslationLimitError
}

/**
 * Coalesces single-text requests made in the same moment (e.g. every card title of a
 * results page) into one batch, which MyMemory receives as a few line-separated requests.
 */
const BATCH_DELAY_MS = 30

interface Pending {
  text: string
  resolve: (value: string) => void
  reject: (reason: unknown) => void
}

const queues = new Map<string, Pending[]>()

export function translateText(text: string, target: string): Promise<string> {
  const cached = readCached(text, target)
  if (cached !== undefined) return Promise.resolve(cached)

  return new Promise((resolve, reject) => {
    const queue = queues.get(target)
    if (queue) {
      queue.push({ text, resolve, reject })
      return
    }
    queues.set(target, [{ text, resolve, reject }])
    setTimeout(() => {
      const batch = queues.get(target) ?? []
      queues.delete(target)
      translateTexts(
        batch.map((item) => item.text),
        target,
      ).then(
        (translated) => batch.forEach((item, index) => item.resolve(translated[index])),
        (error: unknown) => batch.forEach((item) => item.reject(error)),
      )
    }, BATCH_DELAY_MS)
  })
}
