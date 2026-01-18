import { useMemo } from 'react'
import { useParams } from 'react-router'
import { getRecipesByCategory } from '@/core/api/mealdb'
import type { RecipeSummary } from '@/core/models/recipe'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { BackButton } from '@/shared/components/BackButton'
import { PageHeader } from '@/shared/components/PageHeader'
import { RecipeCard } from '@/shared/components/RecipeCard'
import { RecipeGrid, RecipeGridSkeleton } from '@/shared/components/RecipeGrid'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import { categoryLabel } from '@/shared/utils/labels'
import styles from './Browse.module.css'

export type BrowseKind = 'category'

interface BrowseConfig {
  param: string
  eyebrow: string
  backTo: string
  backLabel: string
  label: (value: string) => string
  load: (value: string, signal: AbortSignal) => Promise<RecipeSummary[]>
  toFavorite: (value: string) => { category?: string; area?: string }
}

const CONFIG: Record<BrowseKind, BrowseConfig> = {
  category: {
    param: 'category',
    eyebrow: 'Categoria',
    backTo: '/categorias',
    backLabel: 'Todas as categorias',
    label: categoryLabel,
    load: getRecipesByCategory,
    toFavorite: (category) => ({ category }),
  },
}

/** Recipe list for a single category or cuisine. */
export function BrowseResults({ kind }: { kind: BrowseKind }) {
  const config = CONFIG[kind]
  const value = useParams()[config.param] ?? ''
  const title = config.label(value)
  useDocumentTitle(title)

  const fetcher = useMemo(
    () => (signal: AbortSignal) => config.load(value, signal),
    [config, value],
  )
  const { status, data, error, reload } = useAsync(fetcher)

  return (
    <div className="container">
      <div className={styles.back}>
        <BackButton fallback={config.backTo} label={config.backLabel} />
      </div>
      <PageHeader
        eyebrow={config.eyebrow}
        title={title}
        description={
          status === 'success' && data.length > 0
            ? `${data.length} ${data.length === 1 ? 'receita' : 'receitas'}`
            : undefined
        }
      />

      {status === 'loading' && <RecipeGridSkeleton />}

      {status === 'error' && <ErrorState error={error} onRetry={reload} />}

      {status === 'success' &&
        (data.length === 0 ? (
          <EmptyState
            title="Nenhuma receita por aqui ainda"
            description="A base de dados ainda não tem receitas para esta seleção."
          />
        ) : (
          <RecipeGrid label={`Receitas: ${title}`}>
            {data.map((recipe) => {
              const favorite = { ...recipe, ...config.toFavorite(value) }
              return (
                <RecipeCard
                  key={recipe.id}
                  to={`/receita/${recipe.id}`}
                  name={recipe.name}
                  thumbnail={recipe.thumbnail}
                  action={<FavoriteButton recipe={favorite} variant="icon" />}
                />
              )
            })}
          </RecipeGrid>
        ))}
    </div>
  )
}
