import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CUISINE_REGION_CODES } from '@/shared/utils/cuisineRegions'
import { toSupportedLanguage, type Language } from './index'
import type taxonomy from './locales/pt-BR/taxonomy'

type CategoryName = keyof typeof taxonomy.categories

/** The active language, always one of the supported ones. */
export function useLanguage(): Language {
  const { i18n } = useTranslation()
  return toSupportedLanguage(i18n.resolvedLanguage)
}

/**
 * Labels for TheMealDB enums in the active language. Categories come from the
 * translation files; cuisines are mapped to ISO region codes and named by
 * Intl.DisplayNames, so all ~190 countries are covered without hand translation.
 * Unknown values are returned as the API sent them.
 */
export function useTaxonomy() {
  const { t, i18n } = useTranslation('taxonomy')
  const language = useLanguage()

  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([language], { type: 'region' })
    } catch {
      return null
    }
  }, [language])

  const category = useCallback(
    (name: string | null | undefined): string | null => {
      if (!name) return null
      return i18n.exists(`categories.${name}`, { ns: 'taxonomy' })
        ? t(`categories.${name as CategoryName}`)
        : name
    },
    [i18n, t],
  )

  const cuisine = useCallback(
    (name: string | null | undefined): string | null => {
      if (!name) return null
      const code = CUISINE_REGION_CODES[name]
      return (code && regionNames?.of(code)) || name
    },
    [regionNames],
  )

  /** Locale-aware comparison for sorting translated labels. */
  const compare = useCallback(
    (a: string, b: string) => a.localeCompare(b, language, { sensitivity: 'base' }),
    [language],
  )

  return useMemo(
    () => ({ category, cuisine, compare, language }),
    [category, cuisine, compare, language],
  )
}
