import { Skeleton } from '@/shared/components/Skeleton'
import styles from './RecipeDetail.module.css'

export function RecipeDetailSkeleton() {
  return (
    <div className={styles.detail} role="status">
      <span className="visually-hidden">Carregando receita…</span>
      <div className={styles.hero} aria-hidden="true">
        <Skeleton className={styles.media} />
        <div className={styles.skeleton}>
          <Skeleton width="30%" height="1.5rem" />
          <Skeleton width="85%" height="2.75rem" />
          <Skeleton width="60%" height="2.75rem" />
          <Skeleton width="45%" height="2.75rem" />
        </div>
      </div>
      <div className={styles.content} aria-hidden="true">
        <div className={styles.skeleton}>
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} height="2.5rem" />
          ))}
        </div>
        <div className={styles.skeleton}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} height="4.5rem" />
          ))}
        </div>
      </div>
    </div>
  )
}
