import styles from './LoadMoreButton.module.css'
import { useTranslation } from 'react-i18next'

interface LoadMoreButtonProps {
  remaining: number
  onClick: () => void
}

export function LoadMoreButton({ remaining, onClick }: LoadMoreButtonProps) {
  const { t } = useTranslation()
  return (
    <div className={styles.wrapper}>
      <button type="button" className="btn btn--ghost" onClick={onClick}>
        {t('actions.showMore')}
        <span className={styles.remaining}>{t('actions.remaining', { count: remaining })}</span>
      </button>
    </div>
  )
}
