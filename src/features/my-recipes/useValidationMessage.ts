import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type myRecipes from '@/i18n/locales/pt-BR/myRecipes'

type ValidationKey = `validation.${keyof typeof myRecipes.validation}`

/**
 * The zod schema stores translation keys as messages (optionally "key:max"), so the
 * same schema serves both languages and messages switch with the active language.
 */
export function useValidationMessage() {
  const { t, i18n } = useTranslation('myRecipes')

  return useCallback(
    (message: string | undefined): string | undefined => {
      if (!message) return undefined
      const [key, max] = message.split(':')
      if (!i18n.exists(key, { ns: 'myRecipes' })) return message
      return t(key as ValidationKey, { max: max ? Number(max) : undefined })
    },
    [i18n, t],
  )
}
