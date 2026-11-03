/**
 * Keyless translation providers, tried in order:
 * 1. the browser's built-in Translator API (Chrome 138+, on-device, no network);
 * 2. the public MyMemory API (https://mymemory.translated.net/doc/spec.php), free and keyless,
 *    limited to 500 bytes per request. Sending a contact email (`de`) raises the daily quota from
 *    about 5000 to about 50000 characters per IP.
 */

export const SOURCE_LANGUAGE = 'en'
export const MYMEMORY_MAX_CHARS = 500
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'
/** Contact address MyMemory asks for to grant the higher anonymous quota. */
const MYMEMORY_CONTACT = 'contato@brunoisaac.dev'

/** The daily quota is over (or the service refused): show the original text. */
export class TranslationLimitError extends Error {
  constructor(message = 'Translation quota exceeded') {
    super(message)
    this.name = 'TranslationLimitError'
  }
}

export interface TranslationProvider {
  readonly name: string
  /** Translates every text; the result has the same length and order. */
  translate(texts: string[], target: string, signal?: AbortSignal): Promise<string[]>
}

// Browser Translator API (not yet in TypeScript's DOM types).
type Availability = 'unavailable' | 'downloadable' | 'downloading' | 'available'

interface BrowserTranslator {
  translate(text: string, options?: { signal?: AbortSignal }): Promise<string>
}

interface TranslatorFactory {
  availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<Availability>
  create(options: { sourceLanguage: string; targetLanguage: string }): Promise<BrowserTranslator>
}

function getTranslatorFactory(): TranslatorFactory | null {
  const scope = globalThis as typeof globalThis & { Translator?: TranslatorFactory }
  return 'Translator' in scope && scope.Translator ? scope.Translator : null
}

/** "pt-BR" -> "pt": the Translator API expects base language tags. */
function baseLanguage(target: string): string {
  return target.split('-')[0]
}

const translators = new Map<string, Promise<BrowserTranslator | null>>()

function getBrowserTranslator(target: string): Promise<BrowserTranslator | null> {
  const factory = getTranslatorFactory()
  if (!factory) return Promise.resolve(null)
  const targetLanguage = baseLanguage(target)
  let pending = translators.get(targetLanguage)
  if (!pending) {
    pending = (async () => {
      const options = { sourceLanguage: SOURCE_LANGUAGE, targetLanguage }
      const availability = await factory.availability(options)
      if (availability === 'unavailable') return null
      // "downloadable" may need a user gesture to start the model download; if create()
      // refuses, the next provider takes over.
      return factory.create(options)
    })().catch(() => null)
    translators.set(targetLanguage, pending)
  }
  return pending
}

export const browserProvider: TranslationProvider = {
  name: 'browser',
  async translate(texts, target, signal) {
    const translator = await getBrowserTranslator(target)
    if (!translator) throw new Error('Browser Translator API unavailable')
    return Promise.all(texts.map((text) => translator.translate(text, { signal })))
  },
}

export function isBrowserTranslatorSupported(): boolean {
  return getTranslatorFactory() !== null
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&quot;': '"',
  '&apos;': "'",
  '&lt;': '<',
  '&gt;': '>',
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&(?:amp|quot|apos|lt|gt);/g, (entity) => ENTITIES[entity] ?? entity)
}

interface MyMemoryResponse {
  responseData?: { translatedText?: string }
  responseStatus?: number | string
  quotaFinished?: boolean
}

/** Remembers a refused quota for the rest of the day, to avoid hammering the API. */
const BLOCKED_KEY = 'receitario:translations:blocked'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function isBlockedToday(): boolean {
  try {
    return window.localStorage.getItem(BLOCKED_KEY) === today()
  } catch {
    return false
  }
}

function blockForToday(): void {
  try {
    window.localStorage.setItem(BLOCKED_KEY, today())
  } catch {
    // ignore
  }
}

async function myMemoryRequest(text: string, target: string, signal?: AbortSignal) {
  const url = new URL(MYMEMORY_URL)
  url.searchParams.set('q', text)
  url.searchParams.set('langpair', `${SOURCE_LANGUAGE}|${target}`)
  url.searchParams.set('de', MYMEMORY_CONTACT)

  const response = await fetch(url, { signal })
  if (response.status === 429 || response.status === 403) {
    blockForToday()
    throw new TranslationLimitError()
  }
  if (!response.ok) throw new Error(`MyMemory responded with ${response.status}`)

  const body = (await response.json()) as MyMemoryResponse
  const translated = body.responseData?.translatedText ?? ''
  const status = Number(body.responseStatus)
  if (body.quotaFinished || status === 429 || /MYMEMORY WARNING/i.test(translated)) {
    blockForToday()
    throw new TranslationLimitError()
  }
  if (status !== 200 || !translated) throw new Error(`MyMemory status ${body.responseStatus}`)
  return decodeEntities(translated)
}

/** Splits a long text at sentence (then word) boundaries into pieces of at most `max` chars. */
export function splitForRequest(text: string, max = MYMEMORY_MAX_CHARS): string[] {
  const flat = text.replace(/\s*\n\s*/g, ' ').trim()
  if (flat.length <= max) return flat ? [flat] : []

  const pieces: string[] = []
  let current = ''
  const push = () => {
    if (current) pieces.push(current)
    current = ''
  }
  for (const sentence of flat.split(/(?<=[.!?;])\s+/)) {
    const words = sentence.length > max ? sentence.split(/\s+/) : [sentence]
    for (const word of words) {
      const part = word.length > max ? word.slice(0, max) : word
      const candidate = current ? `${current} ${part}` : part
      if (candidate.length > max) {
        push()
        current = part
      } else {
        current = candidate
      }
    }
  }
  push()
  return pieces
}

/**
 * Packs pieces into requests of at most `max` characters joined by line breaks
 * (MyMemory keeps them), then maps the lines back. If the line count ever differs,
 * that request is retried piece by piece.
 */
export const myMemoryProvider: TranslationProvider = {
  name: 'mymemory',
  async translate(texts, target, signal) {
    if (isBlockedToday()) throw new TranslationLimitError()

    const pieces = texts.map((text) => splitForRequest(text))
    const flat = pieces.flat()
    const translatedFlat: string[] = new Array<string>(flat.length)

    const batches: number[][] = []
    let batch: number[] = []
    let size = 0
    flat.forEach((piece, index) => {
      const extra = batch.length > 0 ? piece.length + 1 : piece.length
      if (batch.length > 0 && size + extra > MYMEMORY_MAX_CHARS) {
        batches.push(batch)
        batch = []
        size = 0
      }
      batch.push(index)
      size += batch.length > 1 ? piece.length + 1 : piece.length
    })
    if (batch.length > 0) batches.push(batch)

    // Sequential on purpose: friendlier to a free, rate-limited service.
    for (const indexes of batches) {
      const joined = indexes.map((index) => flat[index]).join('\n')
      const lines = (await myMemoryRequest(joined, target, signal)).split('\n')
      if (lines.length === indexes.length) {
        indexes.forEach((index, position) => (translatedFlat[index] = lines[position].trim()))
      } else {
        for (const index of indexes) {
          translatedFlat[index] = await myMemoryRequest(flat[index], target, signal)
        }
      }
    }

    let cursor = 0
    return pieces.map((parts, index) => {
      if (parts.length === 0) return texts[index]
      const translated = translatedFlat.slice(cursor, cursor + parts.length).join(' ')
      cursor += parts.length
      return translated
    })
  },
}

/** Exposed for tests. */
export function resetProviders(): void {
  translators.clear()
}
