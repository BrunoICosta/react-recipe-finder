import { describe, expect, it } from 'vitest'
import { makeRawMeal } from '@/test/fixtures'
import {
  extractIngredients,
  getYoutubeId,
  parseTags,
  splitInstructions,
  toCategory,
  toRecipe,
} from './normalize'

describe('extractIngredients', () => {
  it('keeps only filled ingredient slots, paired with their measures', () => {
    expect(extractIngredients(makeRawMeal())).toEqual([
      { name: 'soy sauce', measure: '3/4 cup' },
      { name: 'water', measure: '1/2 cup' },
      { name: 'chicken breasts', measure: '2' },
    ])
  })

  it('trims values and tolerates a missing measure', () => {
    const meal = makeRawMeal({ strIngredient1: '  salt ', strMeasure1: null })
    expect(extractIngredients(meal)[0]).toEqual({ name: 'salt', measure: '' })
  })
})

describe('splitInstructions', () => {
  it('splits on line breaks and drops blank lines', () => {
    expect(splitInstructions('Mix.\r\n\r\nBake.\nServe.')).toEqual(['Mix.', 'Bake.', 'Serve.'])
  })

  it('removes "STEP n" headings and numbering', () => {
    const text = 'STEP 1\r\nChop the onion.\r\nstep 2: Fry it.\r\n3. Serve hot.'
    expect(splitInstructions(text)).toEqual(['Chop the onion.', 'Fry it.', 'Serve hot.'])
  })

  it('strips leading bullets and checkbox glyphs', () => {
    const text = '*Meanwhile, steam the vegetables.\n▢ Add the rice.\n• Serve.'
    expect(splitInstructions(text)).toEqual([
      'Meanwhile, steam the vegetables.',
      'Add the rice.',
      'Serve.',
    ])
  })

  it('treats a dash as a bullet only when followed by a space', () => {
    expect(splitInstructions('- Freeze for 2 hours.\n-18 °C is ideal.')).toEqual([
      'Freeze for 2 hours.',
      '-18 °C is ideal.',
    ])
  })

  it('splits a single paragraph into sentences', () => {
    expect(splitInstructions('Boil water. Add pasta! Drain it.')).toEqual([
      'Boil water.',
      'Add pasta!',
      'Drain it.',
    ])
  })

  it('does not split decimal numbers inside a sentence', () => {
    expect(splitInstructions('Use 1.5 cups of milk.')).toEqual(['Use 1.5 cups of milk.'])
  })

  it('returns an empty list for empty input', () => {
    expect(splitInstructions(null)).toEqual([])
    expect(splitInstructions('   ')).toEqual([])
  })
})

describe('parseTags', () => {
  it('splits comma separated tags', () => {
    expect(parseTags('Meat, Casserole,')).toEqual(['Meat', 'Casserole'])
    expect(parseTags(null)).toEqual([])
  })
})

describe('getYoutubeId', () => {
  it('reads the id from watch and short urls', () => {
    expect(getYoutubeId('https://www.youtube.com/watch?v=4aZr5hZXP_s')).toBe('4aZr5hZXP_s')
    expect(getYoutubeId('https://youtu.be/abc123')).toBe('abc123')
  })

  it('returns null for missing or invalid urls', () => {
    expect(getYoutubeId('')).toBeNull()
    expect(getYoutubeId('not a url')).toBeNull()
  })
})

describe('toRecipe', () => {
  it('maps a raw meal into the domain model', () => {
    const recipe = toRecipe(makeRawMeal())
    expect(recipe).toMatchObject({
      id: '52772',
      name: 'Teriyaki Chicken Casserole',
      category: 'Chicken',
      area: 'Japanese',
      tags: ['Meat', 'Casserole'],
      youtubeUrl: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
      sourceUrl: null,
    })
    expect(recipe.instructions).toHaveLength(3)
    expect(recipe.ingredients).toHaveLength(3)
  })

  it('falls back to the country when the area is missing', () => {
    expect(toRecipe(makeRawMeal({ strArea: null, strCountry: 'Brazil' })).area).toBe('Brazil')
  })
})

describe('toCategory', () => {
  it('maps a raw category', () => {
    expect(
      toCategory({
        idCategory: '1',
        strCategory: 'Beef',
        strCategoryThumb: 'beef.png',
        strCategoryDescription: ' Beef is tasty. ',
      }),
    ).toEqual({ id: '1', name: 'Beef', thumbnail: 'beef.png', description: 'Beef is tasty.' })
  })
})
