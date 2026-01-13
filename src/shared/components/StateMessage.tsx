import type { ReactNode } from 'react'
import { AlertIcon, SearchIcon } from './icons'
import styles from './StateMessage.module.css'

interface StateMessageProps {
  title: string
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: StateMessageProps) {
  return (
    <div className={styles.state}>
      <span className={styles.icon}>{icon ?? <SearchIcon size={28} />}</span>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}

interface ErrorStateProps {
  error?: Error
  title?: string
  onRetry?: () => void
}

export function ErrorState({ error, title = 'Algo deu errado', onRetry }: ErrorStateProps) {
  return (
    <div className={`${styles.state} ${styles.error}`} role="alert">
      <span className={styles.icon}>
        <AlertIcon size={28} />
      </span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>
        {error?.message ?? 'Não foi possível carregar os dados. Tente novamente.'}
      </p>
      {onRetry && (
        <div className={styles.action}>
          <button type="button" className="btn btn--primary" onClick={onRetry}>
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  )
}
