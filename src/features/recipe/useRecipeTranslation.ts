import { useMemo } from 'react'
import { useTranslatedTexts, type TranslationStatus } from '@/core/translation/useAutoTranslation'
import type { Recipe } from '@/core/models/recipe'

/**
 * Flattens the translatable parts of a recipe (name, ingredients, measures and steps)
 * into one list, translates it and rebuilds the recipe in the same shape.
 */
export function useRecipeTranslation(recipe: Recipe | null | undefined): {
  recipe: Recipe | null
  status: TranslationStatus
  limitReached: boolean
} {
  const texts = useMemo(
    () =>
      recipe
        ? [
            recipe.name,
            ...recipe.ingredients.flatMap((ingredient) => [ingredient.name, ingredient.measure]),
            ...recipe.instructions,
          ]
        : [],
    [recipe],
  )
  const { texts: translated, status, limitReached } = useTranslatedTexts(texts)

  const display = useMemo(() => {
    if (!recipe) return null
    if (translated === texts) return recipe
    let cursor = 1
    const ingredients = recipe.ingredients.map((ingredient) => {
      const name = translated[cursor]
      const measure = translated[cursor + 1]
      cursor += 2
      return { name, measure, sourceName: ingredient.name }
    })
    return {
      ...recipe,
      name: translated[0],
      ingredients,
      instructions: recipe.instructions.map((_, index) => translated[cursor + index]),
    }
  }, [recipe, texts, translated])

  return { recipe: display, status, limitReached }
}
