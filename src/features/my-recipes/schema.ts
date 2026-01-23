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

/** Optional text field: empty strings are valid and kept as "". */
const optionalText = (max: number) => z.string().trim().max(max, `Use no máximo ${max} caracteres.`)

export const ingredientSchema = z.object({
  name: z.string().trim().min(1, 'Informe o ingrediente.').max(60, 'Use no máximo 60 caracteres.'),
  measure: optionalText(40),
})

export const recipeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome precisa ter pelo menos 3 caracteres.')
    .max(80, 'Use no máximo 80 caracteres.'),
  category: optionalText(40),
  area: optionalText(40),
  thumbnail: optionalText(500).refine(
    (value) => value === '' || isHttpUrl(value),
    'Informe um endereço de imagem válido (http ou https).',
  ),
  youtubeUrl: optionalText(500).refine(
    (value) => value === '' || isYoutubeUrl(value),
    'Informe um link do YouTube válido.',
  ),
  ingredients: z
    .array(ingredientSchema)
    .min(1, 'Adicione pelo menos um ingrediente.')
    .max(MAX_INGREDIENTS, `Use no máximo ${MAX_INGREDIENTS} ingredientes.`),
  instructions: z
    .string()
    .trim()
    .min(20, 'Descreva o modo de preparo (pelo menos 20 caracteres).')
    .max(5000, 'Use no máximo 5000 caracteres.'),
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
