import type { Category, Ingredient, Recipe, RecipeSummary } from '@/core/models/recipe'
import type { RawCategory, RawMeal, RawMealPreview } from './types'

const MAX_INGREDIENTS = 20
const STEP_HEADING = /^step\s*\d+\s*[:.)-]?\s*/i
const NUMBERED_LINE = /^\d+\s*[.)-]\s+/
const SENTENCE_BREAK = /(?<=[.!?])\s+(?=[A-Z0-9])/

function clean(value: string | null | undefined): string {
  return value?.trim() ?? ''
}

function nullable(value: string | null | undefined): string | null {
  const trimmed = clean(value)
  return trimmed === '' ? null : trimmed
}

export function extractIngredients(meal: RawMeal): Ingredient[] {
  const ingredients: Ingredient[] = []
  for (let index = 1; index <= MAX_INGREDIENTS; index++) {
    const name = clean(meal[`strIngredient${index}`])
    if (name === '') continue
    ingredients.push({ name, measure: clean(meal[`strMeasure${index}`]) })
  }
  return ingredients
}

/**
 * Turns the free-form instructions text into a list of steps. TheMealDB mixes
 * line breaks, "STEP 1" headings and numbered lines, so all of those are handled.
 */
export function splitInstructions(text: string | null | undefined): string[] {
  const lines = clean(text)
    .split(/\r?\n/)
    .map((line) => line.trim().replace(STEP_HEADING, '').replace(NUMBERED_LINE, '').trim())
    .filter((line) => line !== '')

  if (lines.length === 1) {
    return lines[0]
      .split(SENTENCE_BREAK)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
  }
  return lines
}

export function parseTags(tags: string | null | undefined): string[] {
  return clean(tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function getYoutubeId(url: string | null | undefined): string | null {
  const value = nullable(url)
  if (!value) return null
  try {
    const parsed = new URL(value)
    if (parsed.hostname.endsWith('youtu.be')) return nullable(parsed.pathname.slice(1))
    return nullable(parsed.searchParams.get('v'))
  } catch {
    return null
  }
}

export function toRecipeSummary(meal: RawMealPreview): RecipeSummary {
  return { id: meal.idMeal, name: clean(meal.strMeal), thumbnail: nullable(meal.strMealThumb) }
}

export function toRecipe(meal: RawMeal): Recipe {
  return {
    ...toRecipeSummary(meal),
    category: nullable(meal.strCategory),
    area: nullable(meal.strArea) ?? nullable(meal.strCountry),
    instructions: splitInstructions(meal.strInstructions),
    ingredients: extractIngredients(meal),
    tags: parseTags(meal.strTags),
    youtubeUrl: nullable(meal.strYoutube),
    sourceUrl: nullable(meal.strSource),
  }
}

export function toCategory(category: RawCategory): Category {
  return {
    id: category.idCategory,
    name: category.strCategory,
    thumbnail: category.strCategoryThumb,
    description: clean(category.strCategoryDescription),
  }
}
