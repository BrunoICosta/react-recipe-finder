import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { useTaxonomy } from '@/i18n/useTaxonomy'
import { RecipeCard } from '@/shared/components/RecipeCard'
import { PagedRecipeGrid } from '@/shared/components/PagedRecipeGrid'
import { RecipeGridSkeleton } from '@/shared/components/RecipeGrid'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import { SearchBar } from './SearchBar'
import { SearchModeToggle } from './SearchModeToggle'
import { parseSearchMode, SEARCH_MODES, type SearchMode } from './searchModes'
import { useSearchQuery } from './useSearchQuery'
import styles from './SearchPage.module.css'

export default function SearchPage() {
  const { t } = useTranslation('search')
  const taxonomy = useTaxonomy()
  const [params, setParams] = useSearchParams()
  const mode = parseSearchMode(params.get('por'))
  const { term, setTerm, query, submit, apply } = useSearchQuery()
  useDocumentTitle(query ? t('title', { query }) : null)

  const setMode = useCallback(
    (next: SearchMode) => {
      setParams(
        (previous) => {
          const updated = new URLSearchParams(previous)
          if (next === 'nome') updated.delete('por')
          else updated.set('por', next)
          return updated
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const fetcher = useMemo(
    () => (query ? (signal: AbortSignal) => SEARCH_MODES[mode].search(query, signal) : null),
    [mode, query],
  )
  const { status, data, error, reload } = useAsync(fetcher)

  return (
    <div className="container">
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
        <h1 className={styles.title}>{t('hero.title')}</h1>
        <p className={styles.subtitle}>{t('hero.subtitle')}</p>
        <div className={styles.search}>
          <SearchModeToggle value={mode} onChange={setMode} />
          <SearchBar
            value={term}
            onChange={setTerm}
            onSubmit={submit}
            label={t(`modes.${mode}.inputLabel`)}
            placeholder={t(`modes.${mode}.placeholder`)}
          />
        </div>
        <p className={styles.hint}>
          {t('hint')}
          {SEARCH_MODES[mode].suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              lang="en"
              className={styles.suggestion}
              onClick={() => apply(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </p>
      </section>

      <section aria-labelledby="search-results-title" className={styles.results}>
        <h2 id="search-results-title" className="visually-hidden">
          {t('resultsHeading')}
        </h2>

        {status === 'idle' && (
          <EmptyState title={t(`modes.${mode}.idleTitle`)} description={t('idleDescription')} />
        )}

        {status === 'loading' && <RecipeGridSkeleton />}

        {status === 'error' && <ErrorState error={error} onRetry={reload} />}

        {status === 'success' &&
          (data.length === 0 ? (
            <EmptyState
              title={t('emptyTitle', { query })}
              description={t(`modes.${mode}.emptyHint`)}
            />
          ) : (
            <>
              <p className={styles.count} aria-live="polite">
                {t(`modes.${mode}.count`, { count: data.length, query })}
              </p>
              <PagedRecipeGrid
                items={data}
                label={t('resultsLabel', { query })}
                renderItem={(recipe) => (
                  <RecipeCard
                    to={`/receita/${recipe.id}`}
                    name={recipe.name}
                    thumbnail={recipe.thumbnail}
                    meta={[taxonomy.category(recipe.category), taxonomy.cuisine(recipe.area)]}
                    action={<FavoriteButton recipe={recipe} variant="icon" />}
                  />
                )}
              />
            </>
          ))}
      </section>
    </div>
  )
}
