import { renderHook, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RecipeForm } from '@/features/my-recipes/components/RecipeForm'
import FavoritesPage from '@/features/favorites/FavoritesPage'
import { renderWithRouter } from '@/test/render'
import { i18n } from './index'
import { useTaxonomy } from './useTaxonomy'

const noop = () => undefined

describe.each([
  {
    language: 'pt-BR',
    documentTitle: 'Favoritas · Receitário',
    favoritesTitle: 'Receitas favoritas',
    emptyTitle: 'Você ainda não tem favoritas',
    nameError: 'O nome precisa ter pelo menos 3 caracteres.',
    instructionsError: 'Descreva o modo de preparo (pelo menos 20 caracteres).',
    category: 'Sobremesas',
    cuisine: 'Japão',
  },
  {
    language: 'en',
    documentTitle: 'Favorites · Recipe Finder',
    favoritesTitle: 'Favorite recipes',
    emptyTitle: 'You have no favorites yet',
    nameError: 'The name must have at least 3 characters.',
    instructionsError: 'Describe the method (at least 20 characters).',
    category: 'Desserts',
    cuisine: 'Japan',
  },
])('in $language', (expected) => {
  it('renders the favorites page and its document title', async () => {
    await i18n.changeLanguage(expected.language)
    renderWithRouter(<FavoritesPage />)

    expect(screen.getByRole('heading', { name: expected.favoritesTitle })).toBeInTheDocument()
    expect(screen.getByText(expected.emptyTitle)).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe(expected.documentTitle))
  })

  it('shows the zod validation messages in the active language', async () => {
    await i18n.changeLanguage(expected.language)
    const { user } = renderWithRouter(
      <RecipeForm submitLabel="OK" onSubmit={noop} onCancel={noop} />,
    )

    await user.click(screen.getByRole('button', { name: 'OK' }))

    expect(await screen.findByText(expected.nameError)).toBeVisible()
    expect(screen.getByText(expected.instructionsError)).toBeVisible()
  })

  it('labels TheMealDB categories and cuisines', async () => {
    await i18n.changeLanguage(expected.language)
    const { result } = renderHook(() => useTaxonomy())

    expect(result.current.category('Dessert')).toBe(expected.category)
    expect(result.current.cuisine('Japanese')).toBe(expected.cuisine)
    expect(result.current.cuisine('Atlantis')).toBe('Atlantis')
  })
})

it('re-translates visible errors when the language changes', async () => {
  const { user } = renderWithRouter(<RecipeForm submitLabel="OK" onSubmit={noop} onCancel={noop} />)
  await user.click(screen.getByRole('button', { name: 'OK' }))
  expect(await screen.findByText('O nome precisa ter pelo menos 3 caracteres.')).toBeVisible()

  await i18n.changeLanguage('en')

  expect(await screen.findByText('The name must have at least 3 characters.')).toBeVisible()
})
