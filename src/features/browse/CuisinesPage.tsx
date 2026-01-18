import { useDeferredValue, useId, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { listCuisines } from '@/core/api/mealdb'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { SearchIcon } from '@/shared/components/icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { Skeleton } from '@/shared/components/Skeleton'
import { EmptyState, ErrorState } from '@/shared/components/StateMessage'
import styles from './Browse.module.css'

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export default function CuisinesPage() {
  useDocumentTitle('Cozinhas do mundo')
  const { status, data, error, reload } = useAsync(listCuisines)
  const [filter, setFilter] = useState('')
  const deferredFilter = useDeferredValue(filter)
  const filterId = useId()

  const visible = useMemo(() => {
    const needle = normalize(deferredFilter.trim())
    return (data ?? []).filter((cuisine) => normalize(cuisine).includes(needle))
  }, [data, deferredFilter])

  return (
    <div className="container">
      <PageHeader
        title="Cozinhas do mundo"
        description="Escolha um país para descobrir pratos típicos da sua culinária."
        actions={
          <div className={styles.filter}>
            <label htmlFor={filterId} className="visually-hidden">
              Filtrar países
            </label>
            <SearchIcon size={18} className={styles.filterIcon} />
            <input
              id={filterId}
              type="search"
              placeholder="Filtrar países (em inglês)…"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </div>
        }
      />

      {status === 'loading' && (
        <div role="status">
          <span className="visually-hidden">Carregando cozinhas…</span>
          <ul className={styles.chips} aria-hidden="true">
            {Array.from({ length: 24 }, (_, index) => (
              <li key={index}>
                <Skeleton width={`${5 + (index % 4) * 1.5}rem`} height="2.5rem" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'error' && <ErrorState error={error} onRetry={reload} />}

      {status === 'success' &&
        (visible.length === 0 ? (
          <EmptyState
            title={
              filter ? `Nenhum país encontrado para “${filter}”` : 'Nenhuma cozinha disponível'
            }
            description={filter ? 'Os nomes estão em inglês, por exemplo “Brazil”.' : undefined}
          />
        ) : (
          <ul className={styles.chips} aria-label="Países">
            {visible.map((cuisine) => (
              <li key={cuisine}>
                <Link
                  to={`/cozinhas/${encodeURIComponent(cuisine)}`}
                  className={styles.chip}
                  lang="en"
                >
                  {cuisine}
                </Link>
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}
