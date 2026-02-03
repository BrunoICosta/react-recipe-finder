import type ptSearch from '../pt-BR/search'

const search: typeof ptSearch = {
  title: 'Search: {{query}}',
  hero: {
    eyebrow: 'Recipes from all over the world',
    title: 'What are we cooking today?',
    subtitle: 'Search by the name of the dish or by an ingredient you have in the fridge.',
  },
  modeLegend: 'Search by',
  modes: {
    nome: {
      label: 'Dish name',
      inputLabel: 'Search recipes by name',
      placeholder: 'E.g. lasagne, curry, pancakes…',
      idleTitle: 'Start typing the name of a dish',
      emptyHint: 'Check the spelling or try a more general term.',
      count_one: '{{count}} recipe for “{{query}}”',
      count_other: '{{count}} recipes for “{{query}}”',
    },
    ingrediente: {
      label: 'Ingredient',
      inputLabel: 'Search recipes by ingredient',
      placeholder: 'E.g. garlic, chicken breast, rice…',
      idleTitle: 'Type an ingredient you have at home',
      emptyHint: 'Use the ingredient name as it appears in recipes (e.g. “eggs”, “garlic”).',
      count_one: '{{count}} recipe with “{{query}}”',
      count_other: '{{count}} recipes with “{{query}}”',
    },
  },
  hint: 'Try:',
  idleDescription: 'Results show up while you type.',
  resultsHeading: 'Results',
  resultsLabel: 'Recipes for {{query}}',
  emptyTitle: 'No recipes found for “{{query}}”',
}

export default search
