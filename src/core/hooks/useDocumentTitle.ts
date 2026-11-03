import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/** Sets document.title in the active language ("<title> · Receitário"). */
export function useDocumentTitle(title?: string | null): void {
  const { t } = useTranslation()
  const appName = t('app.name')
  const tagline = t('app.tagline')

  useEffect(() => {
    document.title = title ? `${title} · ${appName}` : `${appName} | ${tagline}`
  }, [title, appName, tagline])
}
