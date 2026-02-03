import type ptRecipe from '../pt-BR/recipe'

const recipe: typeof ptRecipe = {
  loading: 'Loading recipe…',
  loadError: 'Could not load the recipe',
  notFound: {
    title: 'Recipe not found',
    description: 'It may have been removed from the database.',
    action: 'Search other recipes',
  },
  classification: 'Classification',
  cardDetails: 'Details',
  stats: {
    ingredients: 'Ingredients',
    steps: 'Steps',
  },
  watchOnYoutube: 'Watch on YouTube',
  originalSource: 'Original recipe',
  ingredients: 'Ingredients',
  noIngredients: 'No ingredients provided.',
  steps: 'Method',
  noSteps: 'No instructions provided.',
}

export default recipe
