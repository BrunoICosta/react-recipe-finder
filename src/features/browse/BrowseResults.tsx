import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { getRecipesByCategory, getRecipesByCuisine } from '@/core/api/mealdb'
import type { RecipeSummary } from '@/core/models/recipe'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { useTaxonomy } from '@/i18n/useTaxonomy'
import { BackButton } from '@/shared/components/BackButton'
import { PageHeader } from '@/shared/components/PageHeader'
import { RecipeCard } from '@/shared/components/RecipeCard'
import { PagedRecipeGrid } from '@/shared/components/PagedRecipeGrid'
import { RecipeGridSkeleton } from '@/shared/components/RecipeGrid'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import { TranslationNotice } from '@/shared/components/TranslationNotice'
import styles from './Browse.module.css'

export type BrowseKind = 'category' | 'cuisine'

interface BrowseConfig {
  param: string
  backTo: string
  load: (value: string, signal: AbortSignal) => Promise<RecipeSummary[]>
  toFavorite: (value: string) => { category?: string; area?: string }
}

const CONFIG: Record<BrowseKind, BrowseConfig> = {
  category: {
    param: 'category',
    backTo: '/categorias',
    load: getRecipesByCategory,
    toFavorite: (category) => ({ category }),
  },
  cuisine: {
    param: 'cuisine',
    backTo: '/cozinhas',
    load: getRecipesByCuisine,
    toFavorite: (area) => ({ area }),
  },
}

/** Recipe list for a single category or cuisine. */
export function BrowseResults({ kind }: { kind: BrowseKind }) {
  const { t } = useTranslation(['browse', 'common'])
  const taxonomy = useTaxonomy()
  const config = CONFIG[kind]
  const value = useParams()[config.param] ?? ''
  const title = (kind === 'category' ? taxonomy.category(value) : taxonomy.cuisine(value)) ?? value
  useDocumentTitle(title)

  const fetcher = useMemo(
    () => (signal: AbortSignal) => config.load(value, signal),
    [config, value],
  )
  const { status, data, error, reload } = useAsync(fetcher)

  return (
    <div className="container">
      <div className={styles.back}>
        <BackButton fallback={config.backTo} label={t(`results.${kind}.back`)} />
      </div>
      <PageHeader
        eyebrow={t(`results.${kind}.eyebrow`)}
        title={title}
        description={
          status === 'success' && data.length > 0
            ? t('common:recipeCount', { count: data.length })
            : undefined
        }
      />

      {status === 'loading' && <RecipeGridSkeleton />}

      {status === 'error' && <ErrorState error={error} onRetry={reload} />}

      {status === 'success' &&
        (data.length === 0 ? (
          <EmptyState title={t('results.emptyTitle')} description={t('results.emptyDescription')} />
        ) : (
          <>
            <div className={styles.notice}>
              <TranslationNotice scope="titles" />
            </div>
            <PagedRecipeGrid
              items={data}
              label={t('results.listLabel', { title })}
              renderItem={(recipe) => (
                <RecipeCard
                  to={`/receita/${recipe.id}`}
                  name={recipe.name}
                  thumbnail={recipe.thumbnail}
                  translateTitle
                  action={
                    <FavoriteButton
                      recipe={{ ...recipe, ...config.toFavorite(value) }}
                      variant="icon"
                    />
                  }
                />
              )}
            />
          </>
        ))}
    </div>
  )
}
