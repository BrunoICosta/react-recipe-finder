import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { i18n, LANGUAGE_STORAGE_KEY } from '@/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  it('shows the current language and switches to English', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    expect(screen.getByRole('group', { name: 'Idioma' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Português (Brasil)' })).toBeChecked()

    await user.click(screen.getByRole('radio', { name: 'English' }))

    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked()
    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument()
    expect(i18n.resolvedLanguage).toBe('en')
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('can switch back to Portuguese', async () => {
    await i18n.changeLanguage('en')
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.click(screen.getByRole('radio', { name: 'Português (Brasil)' }))

    expect(i18n.resolvedLanguage).toBe('pt-BR')
    expect(document.documentElement.lang).toBe('pt-BR')
  })
})
