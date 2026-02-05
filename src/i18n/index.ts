import i18next, { type i18n as I18n } from 'i18next'
import LanguageDetector, { type DetectorOptions } from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { defaultNS, resources } from './resources'

export const SUPPORTED_LANGUAGES = ['pt-BR', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'pt-BR'
export const LANGUAGE_STORAGE_KEY = 'receitario:language'

/** Any Portuguese variant becomes pt-BR, any other language falls back to English. */
export function toSupportedLanguage(language: string | null | undefined): Language {
  if (!language) return DEFAULT_LANGUAGE
  return language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en'
}

export function isLanguage(value: unknown): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language)
}

/** Saved choice first, then the browser languages; pt-BR when nothing is available. */
export const detectionOptions: DetectorOptions = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: LANGUAGE_STORAGE_KEY,
  caches: ['localStorage'],
  convertDetectedLanguage: toSupportedLanguage,
}

function syncDocumentLanguage(language: string): void {
  if (typeof document !== 'undefined') document.documentElement.lang = language
}

/**
 * Creates an initialised instance. The app uses the shared one below; tests build fresh
 * ones with `bindReact: false` so the instance used by components is left untouched.
 */
export function createI18n(
  instance: I18n = i18next.createInstance(),
  { bindReact = true }: { bindReact?: boolean } = {},
): I18n {
  instance.on('languageChanged', syncDocumentLanguage)
  instance.use(LanguageDetector)
  if (bindReact) instance.use(initReactI18next)
  void instance.init({
    resources,
    defaultNS,
    ns: Object.keys(resources[DEFAULT_LANGUAGE]),
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: DEFAULT_LANGUAGE,
    detection: detectionOptions,
    // Resources are bundled, so initialise synchronously and never suspend.
    initAsync: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })
  return instance
}

export const i18n = createI18n(i18next)

/** The active language, always one of the supported ones. */
export function currentLanguage(instance: I18n = i18n): Language {
  return toSupportedLanguage(instance.resolvedLanguage ?? instance.language)
}
