import { Link } from 'react-router'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import styles from './StatusPage.module.css'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('notFound.title'))

  return (
    <section className={`container ${styles.page}`}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1>{t('notFound.title')}</h1>
      <p className={styles.text}>{t('notFound.description')}</p>
      <div className={styles.actions}>
        <Link to="/" className="btn btn--primary">
          {t('actions.searchRecipes')}
        </Link>
      </div>
    </section>
  )
}
