import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { searchRecipesByIngredient, searchRecipesByName } from '@/core/api/mealdb'
import { ApiError } from '@/core/api/http'
import { toRecipe } from '@/core/api/normalize'
import { makeRawMeal } from '@/test/fixtures'
import { renderWithRouter } from '@/test/render'
import SearchPage from './SearchPage'

vi.mock('@/core/api/mealdb', () => ({
  searchRecipesByName: vi.fn(),
  searchRecipesByIngredient: vi.fn(),
}))

const byName = vi.mocked(searchRecipesByName)
const byIngredient = vi.mocked(searchRecipesByIngredient)

describe('SearchPage', () => {
  beforeEach(() => {
    byName.mockReset()
    byIngredient.mockReset()
  })

  it('starts idle without calling the API', () => {
    renderWithRouter(<SearchPage />)
    expect(screen.getByText('Comece digitando o nome de um prato')).toBeInTheDocument()
    expect(byName).not.toHaveBeenCalled()
  })

  it('debounces typing and shows the results', async () => {
    byName.mockResolvedValue([toRecipe(makeRawMeal())])
    const { user, router } = renderWithRouter(<SearchPage />)

    await user.type(screen.getByRole('searchbox'), 'teri')

    expect(await screen.findByText('1 receita para “teri”')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Teriyaki Chicken Casserole' })).toHaveAttribute(
      'href',
      '/receita/52772',
    )
    // One request for the final term, not one per keystroke.
    expect(byName).toHaveBeenCalledTimes(1)
    expect(byName).toHaveBeenCalledWith('teri', expect.any(AbortSignal))
    expect(router.state.location.search).toBe('?q=teri')
  })

  it('reads the query from the URL and shows an empty state', async () => {
    byName.mockResolvedValue([])
    renderWithRouter(<SearchPage />, { route: '/?q=zzz' })

    expect(await screen.findByText('Nenhuma receita encontrada para “zzz”')).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toHaveValue('zzz')
  })

  it('searches by ingredient when that mode is selected', async () => {
    byIngredient.mockResolvedValue([{ id: '1', name: 'Garlic Bread', thumbnail: null }])
    const { user } = renderWithRouter(<SearchPage />)

    await user.click(screen.getByRole('radio', { name: 'Ingrediente' }))
    await user.click(screen.getByRole('button', { name: 'garlic' }))

    expect(await screen.findByText('1 receita com “garlic”')).toBeInTheDocument()
    expect(byIngredient).toHaveBeenCalledWith('garlic', expect.any(AbortSignal))
    expect(byName).not.toHaveBeenCalled()
  })

  it('shows the error and retries', async () => {
    byName.mockRejectedValueOnce(new ApiError('http', 'Server down', 503)).mockResolvedValueOnce([])
    const { user } = renderWithRouter(<SearchPage />, { route: '/?q=pasta' })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'O servidor respondeu com erro (503).',
    )

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await waitFor(() => expect(byName).toHaveBeenCalledTimes(2))
    expect(await screen.findByText('Nenhuma receita encontrada para “pasta”')).toBeInTheDocument()
  })
})
