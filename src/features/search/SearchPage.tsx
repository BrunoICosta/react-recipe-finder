import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { RecipeCard } from '@/shared/components/RecipeCard'
import { RecipeGrid, RecipeGridSkeleton } from '@/shared/components/RecipeGrid'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import { SearchBar } from './SearchBar'
import { SearchModeToggle } from './SearchModeToggle'
import { parseSearchMode, SEARCH_MODES, type SearchMode } from './searchModes'
import { useSearchQuery } from './useSearchQuery'
import styles from './SearchPage.module.css'

function pluralize(count: number): string {
  return count === 1 ? '1 receita' : `${count} receitas`
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const mode = parseSearchMode(params.get('por'))
  const config = SEARCH_MODES[mode]
  const { term, setTerm, query, submit, apply } = useSearchQuery()
  useDocumentTitle(query ? `Busca: ${query}` : null)

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
        <p className={styles.eyebrow}>Receitas do mundo todo</p>
        <h1 className={styles.title}>O que vamos cozinhar hoje?</h1>
        <p className={styles.subtitle}>
          Busque pelo nome do prato ou pelo ingrediente que está na sua geladeira.
        </p>
        <div className={styles.search}>
          <SearchModeToggle value={mode} onChange={setMode} />
          <SearchBar
            value={term}
            onChange={setTerm}
            onSubmit={submit}
            label={config.inputLabel}
            placeholder={config.placeholder}
          />
        </div>
        <p className={styles.hint}>
          A base de receitas está em inglês. Experimente:
          {config.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
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
          Resultados
        </h2>

        {status === 'idle' && (
          <EmptyState
            title={config.idleTitle}
            description="Os resultados aparecem enquanto você digita."
          />
        )}

        {status === 'loading' && <RecipeGridSkeleton />}

        {status === 'error' && <ErrorState error={error} onRetry={reload} />}

        {status === 'success' &&
          (data.length === 0 ? (
            <EmptyState
              title={`Nenhuma receita encontrada para “${query}”`}
              description={
                mode === 'ingrediente'
                  ? 'Use o nome do ingrediente em inglês, como aparece nas receitas (ex.: “eggs”, “garlic”).'
                  : 'Confira a ortografia ou tente um termo mais genérico, em inglês.'
              }
            />
          ) : (
            <>
              <p className={styles.count} aria-live="polite">
                {pluralize(data.length)}{' '}
                {mode === 'ingrediente' ? `com “${query}”` : `para “${query}”`}
              </p>
              <RecipeGrid label={`Receitas para ${query}`}>
                {data.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    to={`/receita/${recipe.id}`}
                    name={recipe.name}
                    thumbnail={recipe.thumbnail}
                    meta={recipe.meta}
                    action={<FavoriteButton recipe={recipe} variant="icon" />}
                  />
                ))}
              </RecipeGrid>
            </>
          ))}
      </section>
    </div>
  )
}
