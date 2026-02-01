import enCommon from './locales/en/common'
import ptCommon from './locales/pt-BR/common'

/** pt-BR is the source of truth: every other language is type-checked against it. */
export const resources = {
  'pt-BR': { common: ptCommon },
  en: { common: enCommon },
} as const

export const defaultNS = 'common'

export type AppResources = (typeof resources)['pt-BR']
