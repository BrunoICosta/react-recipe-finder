import { searchRecipesByIngredient, searchRecipesByName } from '@/core/api/mealdb'
import type { RecipeSummary } from '@/core/models/recipe'

export type SearchMode = 'nome' | 'ingrediente'

export interface SearchResult extends RecipeSummary {
  category?: string | null
  area?: string | null
  meta: (string | null)[]
}

interface SearchModeConfig {
  label: string
  inputLabel: string
  placeholder: string
  suggestions: string[]
  idleTitle: string
  search: (query: string, signal: AbortSignal) => Promise<SearchResult[]>
}

export const SEARCH_MODES: Record<SearchMode, SearchModeConfig> = {
  nome: {
    label: 'Nome do prato',
    inputLabel: 'Buscar receitas pelo nome',
    placeholder: 'Ex.: lasagne, curry, pancakes…',
    suggestions: ['chicken', 'pasta', 'beef', 'cake', 'salmon', 'soup'],
    idleTitle: 'Comece digitando o nome de um prato',
    search: async (query, signal) =>
      (await searchRecipesByName(query, signal)).map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        thumbnail: recipe.thumbnail,
        category: recipe.category,
        area: recipe.area,
        meta: [recipe.category, recipe.area],
      })),
  },
  ingrediente: {
    label: 'Ingrediente',
    inputLabel: 'Buscar receitas por ingrediente',
    placeholder: 'Ex.: garlic, chicken breast, rice…',
    suggestions: ['garlic', 'chicken breast', 'eggs', 'rice', 'tomatoes', 'potatoes'],
    idleTitle: 'Digite um ingrediente que você tem em casa',
    search: async (query, signal) =>
      (await searchRecipesByIngredient(query, signal)).map((recipe) => ({ ...recipe, meta: [] })),
  },
}

export function parseSearchMode(value: string | null): SearchMode {
  return value === 'ingrediente' ? 'ingrediente' : 'nome'
}
