import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { getRecipe } from '@/core/api/mealdb'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { BackButton } from '@/shared/components/BackButton'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import { TranslationNotice } from '@/shared/components/TranslationNotice'
import { RecipeDetail } from './components/RecipeDetail'
import { RecipeDetailSkeleton } from './components/RecipeDetailSkeleton'
import { useRecipeTranslation } from './useRecipeTranslation'
import styles from './RecipePage.module.css'

export default function RecipePage() {
  const { t } = useTranslation('recipe')
  const { id = '' } = useParams()
  const fetcher = useMemo(() => (signal: AbortSignal) => getRecipe(id, signal), [id])
  const { status, data, error, reload } = useAsync(fetcher)

  // TheMealDB content is English: translated on demand when the UI is not.
  const translation = useRecipeTranslation(status === 'success' ? data : null)
  const display = translation.recipe

  useDocumentTitle(status === 'success' ? (display?.name ?? t('notFound.title')) : null)

  return (
    <div className={`container ${styles.page}`}>
      <div>
        <BackButton fallback="/" />
      </div>

      {status === 'loading' && <RecipeDetailSkeleton />}

      {status === 'error' && <ErrorState title={t('loadError')} error={error} onRetry={reload} />}

      {status === 'success' &&
        (data && display ? (
          <RecipeDetail
            key={data.id}
            recipe={display}
            actions={<FavoriteButton recipe={data} />}
            notice={
              <TranslationNotice
                scope="recipe"
                status={translation.status}
                limitReached={translation.limitReached}
              />
            }
          />
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
