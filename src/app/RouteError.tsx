import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import styles from './StatusPage.module.css'

/** Last-resort boundary for render errors and failed chunk downloads. */
export function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : 'Algo inesperado aconteceu ao carregar esta página.'

  return (
    <main className={`container ${styles.page}`}>
      <p className={styles.code} aria-hidden="true">
        Ops!
      </p>
      <h1>Não foi possível exibir a página</h1>
      <p className={styles.text}>{message}</p>
      <div className={styles.actions}>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          Recarregar
        </button>
        <Link to="/" className="btn btn--ghost" reloadDocument>
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
