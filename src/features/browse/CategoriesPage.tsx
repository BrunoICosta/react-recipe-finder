import { Link } from 'react-router'
import { listCategories } from '@/core/api/mealdb'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { PageHeader } from '@/shared/components/PageHeader'
import { Skeleton } from '@/shared/components/Skeleton'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import { categoryLabel } from '@/shared/utils/labels'
import styles from './Browse.module.css'

export default function CategoriesPage() {
  useDocumentTitle('Categorias')
  const { status, data, error, reload } = useAsync(listCategories)

  return (
    <div className="container">
      <PageHeader
        title="Categorias"
        description="Do café da manhã à sobremesa: escolha um tipo de prato para ver as receitas."
      />

      {status === 'loading' && (
        <div role="status">
          <span className="visually-hidden">Carregando categorias…</span>
          <ul className={styles.tiles} aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <li key={index}>
                <Skeleton height="9.5rem" className={styles.tileSkeleton} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'error' && <ErrorState error={error} onRetry={reload} />}

      {status === 'success' &&
        (data.length === 0 ? (
          <EmptyState title="Nenhuma categoria disponível" />
        ) : (
          <ul className={styles.tiles}>
            {data.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/categorias/${encodeURIComponent(category.name)}`}
                  className={styles.tile}
                >
                  <img src={category.thumbnail} alt="" width={160} height={100} loading="lazy" />
                  <span className={styles.tileLabel}>{categoryLabel(category.name)}</span>
                  <span className={styles.tileHint} lang="en">
                    {category.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}
