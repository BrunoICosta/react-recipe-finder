import { Children, type ReactNode } from 'react'
import { Skeleton } from './Skeleton'
import styles from './RecipeGrid.module.css'

interface RecipeGridProps {
  children: ReactNode
  label?: string
}

export function RecipeGrid({ children, label }: RecipeGridProps) {
  return (
    <ul className={styles.grid} aria-label={label}>
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </ul>
  )
}

export function RecipeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-live="polite">
      <span className="visually-hidden">Carregando receitas…</span>
      <ul className={styles.grid} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className={styles.skeletonCard}>
            <Skeleton className={styles.skeletonImage} />
            <div className={styles.skeletonBody}>
              <Skeleton height="1rem" width="80%" />
              <Skeleton height="1rem" width="45%" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
