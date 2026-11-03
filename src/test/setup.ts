import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { resetTranslationCache } from '@/core/translation/cache'
import { resetProviders } from '@/core/translation/providers'
import { setShowOriginal } from '@/core/translation/useAutoTranslation'
import { i18n } from '@/i18n'

beforeEach(async () => {
  // Tests never hit the network: anything not mocked explicitly fails like an offline browser.
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new TypeError('Network disabled in tests'))),
  )
  // Tests assert on pt-BR copy unless they switch language explicitly.
  await i18n.changeLanguage('pt-BR')
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  window.localStorage.clear()
  resetTranslationCache()
  resetProviders()
  setShowOriginal(false)
})
