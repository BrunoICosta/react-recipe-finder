import { useMemo } from 'react'
import { searchRecipesByName } from '@/core/api/mealdb'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { RecipeCard } from '@/shared/components/RecipeCard'
import { RecipeGrid, RecipeGridSkeleton } from '@/shared/components/RecipeGrid'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import { SearchBar } from './SearchBar'
import { useSearchQuery } from './useSearchQuery'
import styles from './SearchPage.module.css'

const SUGGESTIONS = ['chicken', 'pasta', 'beef', 'cake', 'salmon', 'soup']

function pluralize(count: number): string {
  return count === 1 ? '1 receita' : `${count} receitas`
}

export default function SearchPage() {
  const { term, setTerm, query, submit } = useSearchQuery()
  useDocumentTitle(query ? `Busca: ${query}` : null)

  const fetcher = useMemo(
    () => (query ? (signal: AbortSignal) => searchRecipesByName(query, signal) : null),
    [query],
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
          <SearchBar
            value={term}
            onChange={setTerm}
            onSubmit={submit}
            label="Buscar receitas pelo nome"
            placeholder="Ex.: lasagne, curry, pancakes…"
          />
        </div>
        <p className={styles.hint}>
          A base de receitas está em inglês. Experimente:
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className={styles.suggestion}
              onClick={() => setTerm(suggestion)}
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
            title="Comece digitando o nome de um prato"
            description="Os resultados aparecem enquanto você digita."
          />
        )}

        {status === 'loading' && <RecipeGridSkeleton />}

        {status === 'error' && <ErrorState error={error} onRetry={reload} />}

        {status === 'success' &&
          (data.length === 0 ? (
            <EmptyState
              title={`Nenhuma receita encontrada para “${query}”`}
              description="Confira a ortografia ou tente um termo mais genérico, em inglês."
            />
          ) : (
            <>
              <p className={styles.count} aria-live="polite">
                {pluralize(data.length)} para “{query}”
              </p>
              <RecipeGrid label={`Receitas para ${query}`}>
                {data.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    to={`/receita/${recipe.id}`}
                    name={recipe.name}
                    thumbnail={recipe.thumbnail}
                    meta={[recipe.category, recipe.area]}
                  />
                ))}
              </RecipeGrid>
            </>
          ))}
      </section>
    </div>
  )
}
