import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { thumbnailUrl } from '@/shared/utils/image'
import { ChefHatIcon } from './icons'
import styles from './RecipeCard.module.css'

interface RecipeCardProps {
  to: string
  name: string
  thumbnail: string | null
  meta?: (string | null | undefined)[]
  /** Rendered above the image, e.g. a favorite toggle. */
  action?: ReactNode
}

export function RecipeCard({ to, name, thumbnail, meta = [], action }: RecipeCardProps) {
  const image = thumbnailUrl(thumbnail)
  const chips = meta.filter((item): item is string => Boolean(item))

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <img src={image} alt="" loading="lazy" decoding="async" width={350} height={350} />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <ChefHatIcon size={40} />
          </div>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={to} className={styles.link}>
            {name}
          </Link>
        </h3>
        {chips.length > 0 && (
          <ul className={styles.meta} aria-label="Detalhes">
            {chips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        )}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </article>
  )
}
