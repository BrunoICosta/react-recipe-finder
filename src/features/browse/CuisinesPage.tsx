import { useDeferredValue, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { listCuisines } from '@/core/api/mealdb'
import { useAsync } from '@/core/hooks/useAsync'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { useTaxonomy } from '@/i18n/useTaxonomy'
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
  const { t } = useTranslation('browse')
  const taxonomy = useTaxonomy()
  useDocumentTitle(t('cuisines.title'))
  const { status, data, error, reload } = useAsync(listCuisines)
  const [filter, setFilter] = useState('')
  const deferredFilter = useDeferredValue(filter)
  const filterId = useId()

  // Countries are shown (and sorted) in the active language; the API name stays the key.
  const cuisines = useMemo(
    () =>
      (data ?? [])
        .map((name) => ({ name, label: taxonomy.cuisine(name) ?? name }))
        .sort((a, b) => taxonomy.compare(a.label, b.label)),
    [data, taxonomy],
  )

  const visible = useMemo(() => {
    const needle = normalize(deferredFilter.trim())
    return cuisines.filter(
      ({ name, label }) => normalize(label).includes(needle) || normalize(name).includes(needle),
    )
  }, [cuisines, deferredFilter])

  return (
    <div className="container">
      <PageHeader
        title={t('cuisines.title')}
        description={t('cuisines.description')}
        actions={
          <div className={styles.filter}>
            <label htmlFor={filterId} className="visually-hidden">
              {t('cuisines.filterLabel')}
            </label>
            <SearchIcon size={18} className={styles.filterIcon} />
            <input
              id={filterId}
              type="search"
              placeholder={t('cuisines.filterPlaceholder')}
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </div>
        }
      />

      {status === 'loading' && (
        <div role="status">
          <span className="visually-hidden">{t('cuisines.loading')}</span>
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
            title={filter ? t('cuisines.noMatch', { filter }) : t('cuisines.empty')}
            description={filter ? t('cuisines.noMatchHint') : undefined}
          />
        ) : (
          <ul className={styles.chips} aria-label={t('cuisines.listLabel')}>
            {visible.map(({ name, label }) => (
              <li key={name}>
                <Link to={`/cozinhas/${encodeURIComponent(name)}`} className={styles.chip}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}
