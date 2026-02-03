import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { toRecipe } from '@/core/api/normalize'
import { makeRawMeal } from '@/test/fixtures'
import { renderWithRouter } from '@/test/render'
import { RecipeDetail } from './RecipeDetail'

describe('RecipeDetail', () => {
  const recipe = toRecipe(makeRawMeal())

  it('renders ingredients with measures and numbered steps', () => {
    renderWithRouter(<RecipeDetail recipe={recipe} />)

    expect(screen.getByRole('heading', { level: 1, name: recipe.name })).toBeInTheDocument()
    const ingredients = screen.getAllByRole('checkbox')
    expect(ingredients).toHaveLength(3)
    expect(screen.getByText('3/4 cup')).toBeInTheDocument()

    const steps = within(screen.getByRole('region', { name: 'Modo de preparo' })).getAllByRole(
      'listitem',
    )
    expect(steps).toHaveLength(3)
    expect(steps[2]).toHaveTextContent('Bake for 35 minutes.')
  })

  it('links the translated category and cuisine and the YouTube video', () => {
    renderWithRouter(<RecipeDetail recipe={recipe} />)

    expect(screen.getByRole('link', { name: 'Frango' })).toHaveAttribute(
      'href',
      '/categorias/Chicken',
    )
    expect(screen.getByRole('link', { name: 'Japão' })).toHaveAttribute(
      'href',
      '/cozinhas/Japanese',
    )
    expect(screen.getByRole('link', { name: /Assistir no YouTube/ })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=4aZr5hZXP_s',
    )
  })

  it('lets the user tick ingredients off', async () => {
    const { user } = renderWithRouter(<RecipeDetail recipe={recipe} />)
    const [first] = screen.getAllByRole('checkbox')

    await user.click(first)

    expect(first).toBeChecked()
  })
})
