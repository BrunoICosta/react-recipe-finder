import { Link } from 'react-router'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import styles from './StatusPage.module.css'

export default function NotFoundPage() {
  useDocumentTitle('Página não encontrada')

  return (
    <section className={`container ${styles.page}`}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1>Página não encontrada</h1>
      <p className={styles.text}>O endereço que você acessou não existe ou foi removido.</p>
      <div className={styles.actions}>
        <Link to="/" className="btn btn--primary">
          Buscar receitas
        </Link>
      </div>
    </section>
  )
}
