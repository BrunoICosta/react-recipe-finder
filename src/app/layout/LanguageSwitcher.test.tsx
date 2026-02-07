import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { i18n, LANGUAGE_STORAGE_KEY } from '@/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  it('shows the current language as the checked flag and switches to English', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    expect(screen.getByRole('radiogroup', { name: 'Idioma' })).toBeInTheDocument()
    const portuguese = screen.getByRole('radio', { name: 'Português (Brasil)' })
    expect(portuguese).toBeChecked()
    expect(portuguese).toHaveAttribute('lang', 'pt-BR')
    expect(portuguese).toHaveAttribute('title', 'Português (Brasil)')

    await user.click(screen.getByRole('radio', { name: 'English' }))

    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked()
    expect(screen.getByRole('radiogroup', { name: 'Language' })).toBeInTheDocument()
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

  it('is a single tab stop and switches with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.tab()
    expect(screen.getByRole('radio', { name: 'Português (Brasil)' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    const english = screen.getByRole('radio', { name: 'English' })
    expect(english).toHaveFocus()
    expect(english).toBeChecked()
    expect(i18n.resolvedLanguage).toBe('en')

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Português (Brasil)' })).toBeChecked()
  })
})
