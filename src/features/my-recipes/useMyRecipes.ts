import { useCallback } from 'react'
import { splitInstructions } from '@/core/api/normalize'
import { useLocalStorage } from '@/core/hooks/useLocalStorage'
import type { Recipe } from '@/core/models/recipe'
import { userRecipeSchema, type RecipeFormValues, type UserRecipe } from './schema'

export const MY_RECIPES_STORAGE_KEY = 'receitario:my-recipes'

const EMPTY: UserRecipe[] = []

/** Keeps every valid entry, so one corrupted item does not wipe the whole list. */
export function parseUserRecipes(value: unknown): UserRecipe[] {
  if (!Array.isArray(value)) throw new Error('User recipes must be an array')
  return value.flatMap((item) => {
    const result = userRecipeSchema.safeParse(item)
    return result.success ? [result.data] : []
  })
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Adapts a user recipe to the shape the shared detail view understands. */
export function userRecipeToRecipe(recipe: UserRecipe): Recipe {
  return {
    id: recipe.id,
    name: recipe.name,
    thumbnail: recipe.thumbnail || null,
    category: recipe.category || null,
    area: recipe.area || null,
    instructions: splitInstructions(recipe.instructions),
    ingredients: recipe.ingredients,
    tags: [],
    youtubeUrl: recipe.youtubeUrl || null,
    sourceUrl: null,
  }
}

export function useMyRecipes() {
  const [recipes, setRecipes] = useLocalStorage(MY_RECIPES_STORAGE_KEY, EMPTY, {
    parse: parseUserRecipes,
  })

  const getRecipe = useCallback(
    (id: string) => recipes.find((recipe) => recipe.id === id) ?? null,
    [recipes],
  )

  const createRecipe = useCallback(
    (values: RecipeFormValues): UserRecipe => {
      const now = new Date().toISOString()
      const recipe: UserRecipe = { ...values, id: createId(), createdAt: now, updatedAt: now }
      setRecipes((previous) => [recipe, ...previous])
      return recipe
    },
    [setRecipes],
  )

  const updateRecipe = useCallback(
    (id: string, values: RecipeFormValues) => {
      setRecipes((previous) =>
        previous.map((recipe) =>
          recipe.id === id ? { ...recipe, ...values, updatedAt: new Date().toISOString() } : recipe,
        ),
      )
    },
    [setRecipes],
  )

  const deleteRecipe = useCallback(
    (id: string) => setRecipes((previous) => previous.filter((recipe) => recipe.id !== id)),
    [setRecipes],
  )

  return { recipes, getRecipe, createRecipe, updateRecipe, deleteRecipe }
}
