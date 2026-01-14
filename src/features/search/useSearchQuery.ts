import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useDebounce } from '@/core/hooks/useDebounce'

export const SEARCH_DEBOUNCE_MS = 450

/**
 * Keeps the search box responsive while the URL (`?q=`) holds the committed query.
 * The URL is the source of truth, so searches are shareable and survive back/forward.
 */
export function useSearchQuery(param = 'q') {
  const [params, setParams] = useSearchParams()
  const query = params.get(param)?.trim() ?? ''

  const [term, setTerm] = useState(query)
  const debounced = useDebounce(term.trim(), SEARCH_DEBOUNCE_MS)

  const commit = useCallback(
    (value: string) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          if (value) next.set(param, value)
          else next.delete(param)
          return next
        },
        { replace: true },
      )
    },
    [param, setParams],
  )

  // Back/forward navigation changes the URL without touching the input.
  const [lastQuery, setLastQuery] = useState(query)
  if (lastQuery !== query) {
    setLastQuery(query)
    if (term.trim() !== query) setTerm(query)
  }

  useEffect(() => {
    if (debounced !== query) commit(debounced)
    // Only a new debounced value should write to the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const submit = useCallback(() => commit(term.trim()), [commit, term])

  /** Fills the input and searches right away (used by suggestion chips). */
  const apply = useCallback(
    (value: string) => {
      setTerm(value)
      commit(value.trim())
    },
    [commit],
  )

  return { term, setTerm, query, submit, apply }
}
