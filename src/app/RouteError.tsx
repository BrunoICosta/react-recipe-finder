import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import styles from './StatusPage.module.css'
import { useTranslation } from 'react-i18next'

/** Last-resort boundary for render errors and failed chunk downloads. */
export function RouteError() {
  const { t } = useTranslation()
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : t('errors.routeUnexpected')

  return (
    <main className={`container ${styles.page}`}>
      <p className={styles.code} aria-hidden="true">
        Ops!
      </p>
      <h1>{t('errors.routeTitle')}</h1>
      <p className={styles.text}>{message}</p>
      <div className={styles.actions}>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          {t('actions.reload')}
        </button>
        <Link to="/" className="btn btn--ghost" reloadDocument>
          {t('actions.goHome')}
        </Link>
      </div>
    </main>
  )
}
