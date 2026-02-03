import type ptBrowse from '../pt-BR/browse'

const browse: typeof ptBrowse = {
  categories: {
    title: 'Categories',
    description: 'From breakfast to dessert: pick a kind of dish to see its recipes.',
    loading: 'Loading categories…',
    empty: 'No categories available',
  },
  cuisines: {
    title: 'World cuisines',
    description: 'Pick a country to discover typical dishes from its cuisine.',
    filterLabel: 'Filter countries',
    filterPlaceholder: 'Filter countries…',
    loading: 'Loading cuisines…',
    listLabel: 'Countries',
    empty: 'No cuisines available',
    noMatch: 'No country found for “{{filter}}”',
    noMatchHint: 'Try the country name, for example “Brazil”.',
  },
  results: {
    category: {
      eyebrow: 'Category',
      back: 'All categories',
    },
    cuisine: {
      eyebrow: 'Cuisine',
      back: 'All cuisines',
    },
    listLabel: 'Recipes: {{title}}',
    emptyTitle: 'No recipes here yet',
    emptyDescription: 'The database has no recipes for this selection yet.',
  },
}

export default browse
