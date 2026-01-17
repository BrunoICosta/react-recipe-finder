import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '@/core/hooks/useLocalStorage'
import type { RecipeSummary } from '@/core/models/recipe'

export interface FavoriteRecipe extends RecipeSummary {
  category: string | null
  area: string | null
  savedAt: string
}

export type FavoriteInput = RecipeSummary & {
  category?: string | null
  area?: string | null
}

export const FAVORITES_STORAGE_KEY = 'receitario:favorites'

const EMPTY: FavoriteRecipe[] = []

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

function isFavorite(value: unknown): value is FavoriteRecipe {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.savedAt === 'string' &&
    isNullableString(item.thumbnail) &&
    isNullableString(item.category) &&
    isNullableString(item.area)
  )
}

/** Drops malformed entries instead of discarding the whole list. */
function parseFavorites(value: unknown): FavoriteRecipe[] {
  if (!Array.isArray(value)) throw new Error('Favorites must be an array')
  return value.filter(isFavorite)
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage(FAVORITES_STORAGE_KEY, EMPTY, {
    parse: parseFavorites,
  })

  const ids = useMemo(() => new Set(favorites.map((favorite) => favorite.id)), [favorites])

  const isFavorite = useCallback((id: string) => ids.has(id), [ids])

  const addFavorite = useCallback(
    (recipe: FavoriteInput) => {
      setFavorites((previous) =>
        previous.some((favorite) => favorite.id === recipe.id)
          ? previous
          : [
              {
                id: recipe.id,
                name: recipe.name,
                thumbnail: recipe.thumbnail,
                category: recipe.category ?? null,
                area: recipe.area ?? null,
                savedAt: new Date().toISOString(),
              },
              ...previous,
            ],
      )
    },
    [setFavorites],
  )

  const removeFavorite = useCallback(
    (id: string) => setFavorites((previous) => previous.filter((favorite) => favorite.id !== id)),
    [setFavorites],
  )

  const toggleFavorite = useCallback(
    (recipe: FavoriteInput) => {
      if (ids.has(recipe.id)) removeFavorite(recipe.id)
      else addFavorite(recipe)
    },
    [ids, addFavorite, removeFavorite],
  )

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }
}
