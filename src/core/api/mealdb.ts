import type { Category, Recipe, RecipeSummary } from '@/core/models/recipe'
import { getJson } from './http'
import { toCategory, toRecipe, toRecipeSummary } from './normalize'
import type { CategoriesResponse, MealsResponse, RawArea, RawMeal, RawMealPreview } from './types'

/** Public test key "1": TheMealDB allows it for development and educational use. */
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

type Params = Record<string, string>

function buildUrl(endpoint: string, params: Params = {}): string {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  return url.toString()
}

/**
 * Reference data (categories, cuisines, filters, recipe details) barely changes,
 * so successful responses are memoised for the lifetime of the page.
 */
const cache = new Map<string, unknown>()

async function cachedGet<T>(url: string, signal?: AbortSignal): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T
  const data = await getJson<T>(url, signal)
  cache.set(url, data)
  return data
}

function mealsOf<T>(response: MealsResponse<T>): T[] {
  return Array.isArray(response.meals) ? response.meals : []
}

function byName(a: RecipeSummary, b: RecipeSummary): number {
  return a.name.localeCompare(b.name, 'pt-BR')
}

export async function searchRecipesByName(query: string, signal?: AbortSignal): Promise<Recipe[]> {
  const response = await cachedGet<MealsResponse<RawMeal>>(
    buildUrl('search.php', { s: query.trim().toLowerCase() }),
    signal,
  )
  return mealsOf(response).map(toRecipe)
}

async function filterRecipes(params: Params, signal?: AbortSignal): Promise<RecipeSummary[]> {
  const response = await cachedGet<MealsResponse<RawMealPreview>>(
    buildUrl('filter.php', params),
    signal,
  )
  return mealsOf(response).map(toRecipeSummary).sort(byName)
}

export function searchRecipesByIngredient(
  ingredient: string,
  signal?: AbortSignal,
): Promise<RecipeSummary[]> {
  return filterRecipes({ i: ingredient.trim().toLowerCase() }, signal)
}

export function getRecipesByCategory(
  category: string,
  signal?: AbortSignal,
): Promise<RecipeSummary[]> {
  return filterRecipes({ c: category }, signal)
}

export function getRecipesByCuisine(
  cuisine: string,
  signal?: AbortSignal,
): Promise<RecipeSummary[]> {
  return filterRecipes({ a: cuisine }, signal)
}

export async function getRecipe(id: string, signal?: AbortSignal): Promise<Recipe | null> {
  const response = await cachedGet<MealsResponse<RawMeal>>(
    buildUrl('lookup.php', { i: id }),
    signal,
  )
  const [meal] = mealsOf(response)
  return meal ? toRecipe(meal) : null
}

/** Never cached: every call should return a different recipe. */
export async function getRandomRecipe(signal?: AbortSignal): Promise<Recipe | null> {
  const response = await getJson<MealsResponse<RawMeal>>(buildUrl('random.php'), signal)
  const [meal] = mealsOf(response)
  return meal ? toRecipe(meal) : null
}

export async function listCategories(signal?: AbortSignal): Promise<Category[]> {
  const response = await cachedGet<CategoriesResponse>(buildUrl('categories.php'), signal)
  return (response.categories ?? []).map(toCategory)
}

/**
 * Newer TheMealDB entries are filed by country, older ones by demonym ("Italian").
 * The `a` filter accepts country names for both, so countries are the reliable key.
 */
export async function listCuisines(signal?: AbortSignal): Promise<string[]> {
  const response = await cachedGet<MealsResponse<RawArea>>(
    buildUrl('list.php', { a: 'list' }),
    signal,
  )
  const names = mealsOf(response)
    .map((area) => (area.strCountry ?? area.strArea).trim())
    .filter(Boolean)
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

/** Exposed for tests. */
export function clearApiCache(): void {
  cache.clear()
}
