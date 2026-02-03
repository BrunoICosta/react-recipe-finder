import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { recipeFormSchema, type RecipeFormValues } from './schema'
import { parseUserRecipes, userRecipeToRecipe, useMyRecipes } from './useMyRecipes'

const validForm: RecipeFormValues = {
  name: 'Feijoada da vó',
  category: 'Pork',
  area: 'Brazil',
  thumbnail: '',
  youtubeUrl: '',
  ingredients: [
    { name: 'Feijão preto', measure: '1 kg' },
    { name: 'Costelinha', measure: '500 g' },
  ],
  instructions: 'Deixe o feijão de molho.\nCozinhe as carnes.\nJunte tudo e sirva.',
}

describe('recipeFormSchema', () => {
  it('accepts a valid recipe and trims text', () => {
    const result = recipeFormSchema.parse({ ...validForm, name: '  Feijoada da vó  ' })
    expect(result.name).toBe('Feijoada da vó')
  })

  it('requires a name with at least 3 characters', () => {
    const result = recipeFormSchema.safeParse({ ...validForm, name: ' a ' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]).toMatchObject({
      path: ['name'],
      message: 'validation.nameTooShort',
    })
  })

  it('requires at least one ingredient with a name', () => {
    expect(recipeFormSchema.safeParse({ ...validForm, ingredients: [] }).success).toBe(false)

    const blank = recipeFormSchema.safeParse({
      ...validForm,
      ingredients: [{ name: '  ', measure: '1' }],
    })
    expect(blank.error?.issues[0].path).toEqual(['ingredients', 0, 'name'])
  })

  it('validates optional urls only when filled', () => {
    expect(recipeFormSchema.safeParse({ ...validForm, thumbnail: 'not-a-url' }).success).toBe(false)
    expect(
      recipeFormSchema.safeParse({ ...validForm, youtubeUrl: 'https://vimeo.com/123' }).success,
    ).toBe(false)
    expect(
      recipeFormSchema.safeParse({
        ...validForm,
        thumbnail: 'https://example.com/feijoada.jpg',
        youtubeUrl: 'https://youtu.be/abc',
      }).success,
    ).toBe(true)
  })
})

describe('parseUserRecipes', () => {
  it('drops invalid entries and keeps the valid ones', () => {
    const valid = {
      ...validForm,
      id: '1',
      createdAt: '2026-01-20T10:00:00.000Z',
      updatedAt: '2026-01-20T10:00:00.000Z',
    }
    expect(parseUserRecipes([valid, { id: 2 }, null])).toEqual([valid])
  })

  it('rejects non-array payloads', () => {
    expect(() => parseUserRecipes({})).toThrow()
  })
})

describe('userRecipeToRecipe', () => {
  it('splits instructions into steps and maps empty fields to null', () => {
    const recipe = userRecipeToRecipe({
      ...validForm,
      area: '',
      id: 'abc',
      createdAt: '2026-01-20T10:00:00.000Z',
      updatedAt: '2026-01-20T10:00:00.000Z',
    })
    expect(recipe.instructions).toHaveLength(3)
    expect(recipe.area).toBeNull()
    expect(recipe.thumbnail).toBeNull()
  })
})

describe('useMyRecipes', () => {
  it('creates, updates and deletes recipes', () => {
    const { result } = renderHook(() => useMyRecipes())

    let id = ''
    act(() => {
      id = result.current.createRecipe(validForm).id
    })
    expect(result.current.recipes).toHaveLength(1)

    act(() => result.current.updateRecipe(id, { ...validForm, name: 'Feijoada light' }))
    expect(result.current.getRecipe(id)?.name).toBe('Feijoada light')

    act(() => result.current.deleteRecipe(id))
    expect(result.current.recipes).toEqual([])
  })
})
