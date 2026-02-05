import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createI18n,
  currentLanguage,
  i18n,
  LANGUAGE_STORAGE_KEY,
  toSupportedLanguage,
} from './index'

function freshInstance() {
  return createI18n(undefined, { bindReact: false })
}

function mockBrowserLanguages(languages: string[]) {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages)
  vi.spyOn(navigator, 'language', 'get').mockReturnValue(languages[0] ?? '')
}

describe('toSupportedLanguage', () => {
  it('maps every Portuguese variant to pt-BR and anything else to English', () => {
    expect(toSupportedLanguage('pt')).toBe('pt-BR')
    expect(toSupportedLanguage('pt-PT')).toBe('pt-BR')
    expect(toSupportedLanguage('PT-br')).toBe('pt-BR')
    expect(toSupportedLanguage('en-GB')).toBe('en')
    expect(toSupportedLanguage('fr')).toBe('en')
  })

  it('falls back to pt-BR when nothing is known', () => {
    expect(toSupportedLanguage(undefined)).toBe('pt-BR')
    expect(toSupportedLanguage('')).toBe('pt-BR')
  })
})

describe('language detection', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses the browser language when nothing was saved', () => {
    mockBrowserLanguages(['pt-PT', 'en'])
    expect(currentLanguage(freshInstance())).toBe('pt-BR')

    window.localStorage.clear()
    mockBrowserLanguages(['de-DE'])
    expect(currentLanguage(freshInstance())).toBe('en')
  })

  it('prefers the saved choice over the browser language', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')
    mockBrowserLanguages(['pt-BR'])
    expect(currentLanguage(freshInstance())).toBe('en')
  })

  it('defaults to pt-BR when the browser reports no language', () => {
    mockBrowserLanguages([])
    expect(currentLanguage(freshInstance())).toBe('pt-BR')
  })
})

describe('language persistence', () => {
  it('saves the choice and updates <html lang>', async () => {
    await i18n.changeLanguage('en')

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')

    await i18n.changeLanguage('pt-BR')
    expect(document.documentElement.lang).toBe('pt-BR')
  })
})
