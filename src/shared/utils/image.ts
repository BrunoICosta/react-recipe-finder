const MEALDB_IMAGES = 'https://www.themealdb.com/images/'

export type ThumbnailSize = 'small' | 'medium' | 'large'

/** TheMealDB serves resized variants by appending /small, /medium or /large. */
export function thumbnailUrl(url: string | null, size: ThumbnailSize = 'medium'): string | null {
  if (!url) return null
  return url.startsWith(MEALDB_IMAGES) ? `${url}/${size}` : url
}
