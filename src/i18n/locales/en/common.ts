import type ptCommon from '../pt-BR/common'

const common: typeof ptCommon = {
  app: {
    name: 'Recipe Finder',
    tagline: 'find your next recipe',
  },
  nav: {
    label: 'Main',
    search: 'Search',
    categories: 'Categories',
    cuisines: 'Cuisines',
    favorites: 'Favorites',
    myRecipes: 'My recipes',
    favoritesBadge_one: '{{count}} saved',
    favoritesBadge_other: '{{count}} saved',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  layout: {
    skipToContent: 'Skip to content',
    footerData: 'Recipe data by',
    footerAuthor: 'Made by',
  },
  theme: {
    toDark: 'Switch to dark theme',
    toLight: 'Switch to light theme',
    darkTitle: 'Dark theme',
    lightTitle: 'Light theme',
  },
  random: {
    label: 'Surprise me',
    loading: 'Picking…',
    retry: 'Try again',
    title: 'Pick a random recipe',
    error: 'Could not pick a random recipe. Please try again.',
  },
  actions: {
    back: 'Back',
    cancel: 'Cancel',
    retry: 'Try again',
    reload: 'Reload',
    goHome: 'Back to home',
    searchRecipes: 'Search recipes',
    showMore: 'Show more',
    remaining_one: '({{count}} left)',
    remaining_other: '({{count}} left)',
    clearSearch: 'Clear search',
    opensInNewTab: '(opens in a new tab)',
  },
  status: {
    loadingPage: 'Loading page…',
    loadingRecipes: 'Loading recipes…',
  },
  form: {
    optional: '(optional)',
  },
  errors: {
    title: 'Something went wrong',
    generic: 'Could not load the data. Please try again.',
    network: 'Could not reach the server. Check your connection.',
    http: 'The server responded with an error ({{status}}).',
    parse: 'Invalid response from the server.',
    routeTitle: 'This page could not be displayed',
    routeUnexpected: 'Something unexpected happened while loading this page.',
  },
  notFound: {
    title: 'Page not found',
    description: 'The address you opened does not exist or was removed.',
  },
  language: {
    label: 'Language',
  },
  translation: {
    badge: 'Machine translation',
    titlesBadge: 'Titles machine translated',
    showOriginal: 'Show original',
    showTranslation: 'Show translation',
    translating: 'Translating the recipe…',
    failed: 'Could not translate right now. Showing the original text.',
    limit: 'The free daily translation limit was reached. Showing the original text.',
  },
  recipeCount_one: '{{count}} recipe',
  recipeCount_other: '{{count}} recipes',
}

export default common
