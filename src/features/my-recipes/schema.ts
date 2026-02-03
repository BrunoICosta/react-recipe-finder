import { z } from 'zod'

export const MAX_INGREDIENTS = 30

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function isYoutubeUrl(value: string): boolean {
  if (!isHttpUrl(value)) return false
  const host = new URL(value).hostname.replace(/^www\.|^m\./, '')
  return host === 'youtube.com' || host === 'youtu.be'
}

/**
 * Messages are translation keys from the "myRecipes" namespace (`validation.*`). A value
 * after ":" is passed as the `max` interpolation, e.g. "validation.tooLong:40".
 * See translateValidation().
 */
const tooLong = (max: number) => `validation.tooLong:${max}`

/** Optional text field: empty strings are valid and kept as "". */
const optionalText = (max: number) => z.string().trim().max(max, tooLong(max))

export const ingredientSchema = z.object({
  name: z.string().trim().min(1, 'validation.ingredientRequired').max(60, tooLong(60)),
  measure: optionalText(40),
})

export const recipeFormSchema = z.object({
  name: z.string().trim().min(3, 'validation.nameTooShort').max(80, tooLong(80)),
  category: optionalText(40),
  area: optionalText(40),
  thumbnail: optionalText(500).refine(
    (value) => value === '' || isHttpUrl(value),
    'validation.invalidImageUrl',
  ),
  youtubeUrl: optionalText(500).refine(
    (value) => value === '' || isYoutubeUrl(value),
    'validation.invalidYoutubeUrl',
  ),
  ingredients: z
    .array(ingredientSchema)
    .min(1, 'validation.ingredientsMin')
    .max(MAX_INGREDIENTS, `validation.ingredientsMax:${MAX_INGREDIENTS}`),
  instructions: z
    .string()
    .trim()
    .min(20, 'validation.instructionsTooShort')
    .max(5000, tooLong(5000)),
})

/** What the form holds while editing (before trimming). */
export type RecipeFormInput = z.input<typeof recipeFormSchema>
/** What the form hands over after a successful validation. */
export type RecipeFormValues = z.output<typeof recipeFormSchema>

export const userRecipeSchema = recipeFormSchema.extend({
  id: z.string().min(1),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type UserRecipe = z.infer<typeof userRecipeSchema>

export const EMPTY_RECIPE_FORM: RecipeFormInput = {
  name: '',
  category: '',
  area: '',
  thumbnail: '',
  youtubeUrl: '',
  ingredients: [{ name: '', measure: '' }],
  instructions: '',
}
