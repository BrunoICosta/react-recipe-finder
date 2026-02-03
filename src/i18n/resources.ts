import enBrowse from './locales/en/browse'
import enCommon from './locales/en/common'
import enFavorites from './locales/en/favorites'
import enMyRecipes from './locales/en/myRecipes'
import enRecipe from './locales/en/recipe'
import enSearch from './locales/en/search'
import enTaxonomy from './locales/en/taxonomy'
import ptBrowse from './locales/pt-BR/browse'
import ptCommon from './locales/pt-BR/common'
import ptFavorites from './locales/pt-BR/favorites'
import ptMyRecipes from './locales/pt-BR/myRecipes'
import ptRecipe from './locales/pt-BR/recipe'
import ptSearch from './locales/pt-BR/search'
import ptTaxonomy from './locales/pt-BR/taxonomy'

/**
 * One file per namespace and language. pt-BR is the source of truth: each English
 * file is typed as `typeof` its pt-BR counterpart, so a missing key fails the build.
 */
export const resources = {
  'pt-BR': {
    common: ptCommon,
    search: ptSearch,
    recipe: ptRecipe,
    browse: ptBrowse,
    favorites: ptFavorites,
    myRecipes: ptMyRecipes,
    taxonomy: ptTaxonomy,
  },
  en: {
    common: enCommon,
    search: enSearch,
    recipe: enRecipe,
    browse: enBrowse,
    favorites: enFavorites,
    myRecipes: enMyRecipes,
    taxonomy: enTaxonomy,
  },
} as const

export const defaultNS = 'common'

export type AppResources = (typeof resources)['pt-BR']
