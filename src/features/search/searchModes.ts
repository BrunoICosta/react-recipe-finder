import { searchRecipesByIngredient, searchRecipesByName } from '@/core/api/mealdb'
import type { RecipeSummary } from '@/core/models/recipe'

/** URL values (`?por=`); the visible labels live in the "search" namespace. */
export type SearchMode = 'nome' | 'ingrediente'

export const SEARCH_MODE_KEYS: readonly SearchMode[] = ['nome', 'ingrediente']

export interface SearchResult extends RecipeSummary {
  category?: string | null
  area?: string | null
}

interface SearchModeConfig {
  /** TheMealDB data is in English, so suggestions stay in English in both languages. */
  suggestions: string[]
  search: (query: string, signal: AbortSignal) => Promise<SearchResult[]>
}

export const SEARCH_MODES: Record<SearchMode, SearchModeConfig> = {
  nome: {
    suggestions: ['chicken', 'pasta', 'beef', 'cake', 'salmon', 'soup'],
    search: async (query, signal) =>
      (await searchRecipesByName(query, signal)).map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        thumbnail: recipe.thumbnail,
        category: recipe.category,
        area: recipe.area,
      })),
  },
  ingrediente: {
    suggestions: ['garlic', 'chicken breast', 'eggs', 'rice', 'tomatoes', 'potatoes'],
    search: (query, signal) => searchRecipesByIngredient(query, signal),
  },
}

export function parseSearchMode(value: string | null): SearchMode {
  return value === 'ingrediente' ? 'ingrediente' : 'nome'
}
