import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeRawMeal } from '@/test/fixtures'
import { ApiError } from './http'
import {
  clearApiCache,
  getRecipe,
  listCuisines,
  searchRecipesByIngredient,
  searchRecipesByName,
} from './mealdb'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('mealdb client', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    clearApiCache()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
  })

  it('searches by name and normalizes the result', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ meals: [makeRawMeal()] }))

    const recipes = await searchRecipesByName(' Chicken ')

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken',
    )
    expect(recipes[0].name).toBe('Teriyaki Chicken Casserole')
  })

  it('returns an empty list when the API answers meals: null', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ meals: null }))
    await expect(searchRecipesByIngredient('unobtainium')).resolves.toEqual([])
  })

  it('sorts ingredient results by name', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        meals: [
          { idMeal: '2', strMeal: 'Zucchini Pie', strMealThumb: null },
          { idMeal: '1', strMeal: 'Apple Tart', strMealThumb: null },
        ],
      }),
    )
    const result = await searchRecipesByIngredient('egg')
    expect(result.map((recipe) => recipe.id)).toEqual(['1', '2'])
  })

  it('returns null when a recipe does not exist and caches lookups', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ meals: null }))

    await expect(getRecipe('1')).resolves.toBeNull()
    await getRecipe('1')

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('deduplicates and sorts cuisines by country', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        meals: [
          { strArea: 'Italian', strCountry: 'Italy' },
          { strArea: 'Brazilian', strCountry: 'Brazil' },
          { strArea: 'Italian', strCountry: 'Italy' },
        ],
      }),
    )
    await expect(listCuisines()).resolves.toEqual(['Brazil', 'Italy'])
  })

  it('wraps HTTP failures in an ApiError', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, 500))
    await expect(searchRecipesByName('x')).rejects.toBeInstanceOf(ApiError)
  })

  it('wraps network failures in an ApiError', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(searchRecipesByName('x')).rejects.toThrow(/conectar ao servidor/)
  })
})
