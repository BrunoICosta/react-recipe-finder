/** Raw payloads returned by TheMealDB (https://www.themealdb.com/api.php). */

export interface RawMealPreview {
  idMeal: string
  strMeal: string
  strMealThumb: string | null
}

export interface RawMeal extends RawMealPreview {
  strCategory: string | null
  strArea: string | null
  strCountry?: string | null
  strInstructions: string | null
  strTags: string | null
  strYoutube: string | null
  strSource?: string | null
  [ingredient: `strIngredient${number}`]: string | null | undefined
  [measure: `strMeasure${number}`]: string | null | undefined
}

export interface RawCategory {
  idCategory: string
  strCategory: string
  strCategoryThumb: string
  strCategoryDescription: string
}

export interface RawArea {
  strArea: string
  strCountry?: string | null
}

/** TheMealDB answers `{ "meals": null }` when nothing matches. */
export interface MealsResponse<T> {
  meals: T[] | null
}

export interface CategoriesResponse {
  categories: RawCategory[] | null
}
