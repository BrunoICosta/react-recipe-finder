import type { RawMeal } from '@/core/api/types'

export function makeRawMeal(overrides: Partial<RawMeal> = {}): RawMeal {
  return {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strCategory: 'Chicken',
    strArea: 'Japanese',
    strCountry: 'Japan',
    strInstructions:
      'Preheat oven to 350° F.\r\nCombine soy sauce and sugar.\r\n\r\nBake for 35 minutes.',
    strTags: 'Meat,Casserole',
    strYoutube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
    strSource: null,
    strIngredient1: 'soy sauce',
    strMeasure1: '3/4 cup',
    strIngredient2: 'water',
    strMeasure2: '1/2 cup',
    strIngredient3: 'chicken breasts',
    strMeasure3: '2',
    strIngredient4: '',
    strMeasure4: '',
    strIngredient5: null,
    strMeasure5: null,
    ...overrides,
  }
}
