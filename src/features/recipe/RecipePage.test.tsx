import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getRecipe } from '@/core/api/mealdb'
import { toRecipe } from '@/core/api/normalize'
import { i18n } from '@/i18n'
import { makeRawMeal } from '@/test/fixtures'
import { renderWithRouter } from '@/test/render'
import RecipePage from './RecipePage'

vi.mock('@/core/api/mealdb', () => ({ getRecipe: vi.fn() }))

const DICTIONARY: Record<string, string> = {
  'Teriyaki Chicken Casserole': 'Caçarola de frango teriyaki',
  'soy sauce': 'molho de soja',
  '3/4 cup': '3/4 xícara',
}

/** Fake MyMemory: translates known lines, prefixes the others. */
function mockMyMemory() {
  const fetchMock = vi.fn<typeof fetch>((input) => {
    const q = new URL(String(input)).searchParams.get('q') ?? ''
    const translatedText = q
      .split('\n')
      .map((line) => DICTIONARY[line] ?? `(pt) ${line}`)
      .join('\n')
    return Promise.resolve(
      new Response(JSON.stringify({ responseData: { translatedText }, responseStatus: 200 }), {
        status: 200,
      }),
    )
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function renderPage() {
  return renderWithRouter(<RecipePage />, { path: '/receita/:id', route: '/receita/52772' })
}

describe('RecipePage machine translation', () => {
  beforeEach(() => {
    vi.mocked(getRecipe).mockResolvedValue(toRecipe(makeRawMeal()))
  })

  it('translates the recipe to Portuguese and can show the original', async () => {
    mockMyMemory()
    const { user } = renderPage()

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Caçarola de frango teriyaki' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Tradução automática')).toBeInTheDocument()
    const ingredients = within(screen.getByRole('region', { name: 'Ingredientes' }))
    expect(ingredients.getByText('molho de soja')).toBeInTheDocument()
    expect(ingredients.getByText('3/4 xícara')).toBeInTheDocument()
    expect(screen.getByText('(pt) Bake for 35 minutes.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ver original' }))

    expect(
      screen.getByRole('heading', { level: 1, name: 'Teriyaki Chicken Casserole' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver tradução' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('shows the original text with a notice when translation fails', async () => {
    // fetch rejects by default in tests (offline).
    renderPage()

    expect(
      await screen.findByText(
        'Não foi possível traduzir agora. Exibindo o texto original em inglês.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Teriyaki Chicken Casserole' }),
    ).toBeInTheDocument()
  })

  it('does not translate when the interface is in English', async () => {
    await i18n.changeLanguage('en')
    const fetchMock = mockMyMemory()
    renderPage()

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Teriyaki Chicken Casserole' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Machine translation')).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
