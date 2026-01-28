import styles from './LoadMoreButton.module.css'

interface LoadMoreButtonProps {
  remaining: number
  onClick: () => void
}

export function LoadMoreButton({ remaining, onClick }: LoadMoreButtonProps) {
  return (
    <div className={styles.wrapper}>
      <button type="button" className="btn btn--ghost" onClick={onClick}>
        Mostrar mais
        <span className={styles.remaining}>({remaining} restantes)</span>
      </button>
    </div>
  )
}
