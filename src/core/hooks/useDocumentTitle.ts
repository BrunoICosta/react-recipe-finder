import { useEffect } from 'react'

const APP_NAME = 'Receitário'

export function useDocumentTitle(title?: string | null): void {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : `${APP_NAME} — encontre sua próxima receita`
  }, [title])
}
