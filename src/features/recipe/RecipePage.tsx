import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { getRecipe } from '@/core/api/mealdb'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { BackButton } from '@/shared/components/BackButton'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import { RecipeDetail } from './components/RecipeDetail'
import { RecipeDetailSkeleton } from './components/RecipeDetailSkeleton'
import styles from './RecipePage.module.css'

export default function RecipePage() {
  const { t } = useTranslation('recipe')
  const { id = '' } = useParams()
  const fetcher = useMemo(() => (signal: AbortSignal) => getRecipe(id, signal), [id])
  const { status, data, error, reload } = useAsync(fetcher)

  useDocumentTitle(status === 'success' ? (data?.name ?? t('notFound.title')) : null)

  return (
    <div className={`container ${styles.page}`}>
      <div>
        <BackButton fallback="/" />
      </div>

      {status === 'loading' && <RecipeDetailSkeleton />}

      {status === 'error' && <ErrorState title={t('loadError')} error={error} onRetry={reload} />}

      {status === 'success' &&
        (data ? (
          <RecipeDetail key={data.id} recipe={data} actions={<FavoriteButton recipe={data} />} />
        ) : (
          <EmptyState
            title={t('notFound.title')}
            description={t('notFound.description')}
            action={
              <Link to="/" className="btn btn--primary">
                {t('notFound.action')}
              </Link>
            }
          />
        ))}
    </div>
  )
}
