import styles from './PageLoader.module.css'

export function PageLoader() {
  return (
    <div className={styles.loader} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">Carregando página…</span>
    </div>
  )
}
