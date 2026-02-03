import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/test/render'
import { FavoriteButton } from './FavoriteButton'
import FavoritesPage from './FavoritesPage'
import { FAVORITES_STORAGE_KEY } from './useFavorites'

const recipe = { id: '52772', name: 'Teriyaki Chicken Casserole', thumbnail: null }

describe('FavoriteButton', () => {
  it('toggles the favorite and persists it', async () => {
    const { user } = renderWithRouter(<FavoriteButton recipe={recipe} />)
    const button = screen.getByRole('button', { name: 'Favoritar' })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    await user.click(button)

    expect(screen.getByRole('button', { name: 'Favorita' })).toHaveAttribute('aria-pressed', 'true')
    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')
    expect(stored).toEqual([expect.objectContaining({ id: '52772', category: null })])

    await user.click(screen.getByRole('button', { name: 'Favorita' }))
    expect(window.localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('[]')
  })
})

describe('FavoritesPage', () => {
  it('shows an empty state without favorites', () => {
    renderWithRouter(<FavoritesPage />)
    expect(screen.getByText('Você ainda não tem favoritas')).toBeInTheDocument()
  })

  it('lists saved favorites and removes them from the card', async () => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([
        { ...recipe, category: 'Chicken', area: 'Japanese', savedAt: '2026-01-20T10:00:00.000Z' },
      ]),
    )
    const { user } = renderWithRouter(<FavoritesPage />)

    const list = screen.getByRole('list', { name: 'Receitas favoritas' })
    expect(within(list).getByText('Teriyaki Chicken Casserole')).toBeInTheDocument()
    expect(within(list).getByText('Japão')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Remover das favoritas: Teriyaki Chicken Casserole' }),
    )
    expect(screen.getByText('Você ainda não tem favoritas')).toBeInTheDocument()
  })
})
