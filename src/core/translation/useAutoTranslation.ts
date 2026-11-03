import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { useAsync } from '@/core/hooks/useAsync'
import { useLanguage } from '@/i18n/useTaxonomy'
import { isLimitError, translateText, translateTexts } from './translation'

/** API content is English, so only non-English UIs need translating. */
const SOURCE_LANGUAGE = 'en'

export type TranslationStatus = 'off' | 'translating' | 'translated' | 'failed'

// "Ver original" is shared by the detail page and the card titles for the session.
let showOriginal = false
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setShowOriginal(value: boolean): void {
  showOriginal = value
  listeners.forEach((listener) => listener())
}

export function useShowOriginal(): [boolean, (value: boolean) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => showOriginal,
    () => false,
  )
  return [value, setShowOriginal]
}

/** The target language for machine translation, or null when the UI is in English. */
export function useTranslationTarget(enabled = true): string | null {
  const language = useLanguage()
  return enabled && !language.startsWith(SOURCE_LANGUAGE) ? language : null
}

export interface TranslatedTexts {
  texts: readonly string[]
  status: TranslationStatus
  /** The daily quota of the free service is over. */
  limitReached: boolean
}

/** Translates a list of texts on demand; falls back to the originals on any failure. */
export function useTranslatedTexts(texts: readonly string[], enabled = true): TranslatedTexts {
  const target = useTranslationTarget(enabled && texts.length > 0)
  const [original] = useShowOriginal()
  const key = JSON.stringify(texts)

  const fetcher = useMemo(() => {
    if (!target) return null
    const list = JSON.parse(key) as string[]
    return (signal: AbortSignal) => translateTexts(list, target, signal)
  }, [key, target])
  const state = useAsync(fetcher)

  if (!target) return { texts, status: 'off', limitReached: false }
  if (state.status === 'success') {
    return { texts: original ? texts : state.data, status: 'translated', limitReached: false }
  }
  if (state.status === 'error') {
    return { texts, status: 'failed', limitReached: isLimitError(state.error) }
  }
  return { texts, status: 'translating', limitReached: false }
}

/** One card title; requests made at the same time are batched by the service. */
export function useTranslatedTitle(text: string, enabled = true) {
  const target = useTranslationTarget(enabled && text.trim() !== '')
  const [original] = useShowOriginal()

  const fetcher = useMemo(() => (target ? () => translateText(text, target) : null), [text, target])
  const state = useAsync(fetcher)
  const translated = state.status === 'success' && !original && state.data !== text
  return { text: translated ? state.data : text, translated }
}

export function useToggleOriginal() {
  const [original, setOriginal] = useShowOriginal()
  const toggle = useCallback(() => setOriginal(!original), [original, setOriginal])
  return { showOriginal: original, toggle }
}
