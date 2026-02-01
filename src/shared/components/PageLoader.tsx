import styles from './PageLoader.module.css'
import { useTranslation } from 'react-i18next'

export function PageLoader() {
  const { t } = useTranslation()
  return (
    <div className={styles.loader} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">{t('status.loadingPage')}</span>
    </div>
  )
}
