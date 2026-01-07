export interface Ingredient {
  name: string
  measure: string
}

/** Minimal data returned by list/filter endpoints. */
export interface RecipeSummary {
  id: string
  name: string
  thumbnail: string | null
}

export interface Recipe extends RecipeSummary {
  category: string | null
  area: string | null
  instructions: string[]
  ingredients: Ingredient[]
  tags: string[]
  youtubeUrl: string | null
  sourceUrl: string | null
}

export interface Category {
  id: string
  name: string
  thumbnail: string
  description: string
}
