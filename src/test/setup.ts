import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { i18n } from '@/i18n'

// Tests assert on pt-BR copy unless they switch language explicitly.
beforeEach(async () => {
  await i18n.changeLanguage('pt-BR')
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})
