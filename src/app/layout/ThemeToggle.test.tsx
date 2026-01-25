import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { THEME_STORAGE_KEY } from '@/core/theme/useTheme'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme
  })

  it('switches between light and dark and remembers the choice', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')

    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('"dark"')
    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument()
  })

  it('applies a previously saved theme', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, '"dark"')
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
