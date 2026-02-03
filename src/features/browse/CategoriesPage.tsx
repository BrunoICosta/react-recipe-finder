import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { listCategories } from '@/core/api/mealdb'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { useTaxonomy } from '@/i18n/useTaxonomy'
import { PageHeader } from '@/shared/components/PageHeader'
import { Skeleton } from '@/shared/components/Skeleton'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import styles from './Browse.module.css'

export default function CategoriesPage() {
  const { t } = useTranslation('browse')
  const taxonomy = useTaxonomy()
  useDocumentTitle(t('categories.title'))
  const { status, data, error, reload } = useAsync(listCategories)

  return (
    <div className="container">
      <PageHeader title={t('categories.title')} description={t('categories.description')} />

      {status === 'loading' && (
        <div role="status">
          <span className="visually-hidden">{t('categories.loading')}</span>
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
          <EmptyState title={t('categories.empty')} />
        ) : (
          <ul className={styles.tiles}>
            {data.map((category) => {
              const label = taxonomy.category(category.name) ?? category.name
              return (
                <li key={category.id}>
                  <Link
                    to={`/categorias/${encodeURIComponent(category.name)}`}
                    className={styles.tile}
                  >
                    <img src={category.thumbnail} alt="" width={160} height={100} loading="lazy" />
                    <span className={styles.tileLabel}>{label}</span>
                    {label !== category.name && (
                      <span className={styles.tileHint} lang="en">
                        {category.name}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        ))}
    </div>
  )
}
