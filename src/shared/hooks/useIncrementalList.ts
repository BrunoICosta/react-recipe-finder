import { useState } from 'react'

export const PAGE_SIZE = 24

/**
 * Reveals a long list in chunks ("Mostrar mais"). Some ingredients match 200+
 * recipes, and rendering every card at once makes the page heavy on phones.
 */
export function useIncrementalList<T>(items: readonly T[], pageSize = PAGE_SIZE) {
  const [count, setCount] = useState(pageSize)

  // Start over when a new result set arrives.
  const [source, setSource] = useState(items)
  if (source !== items) {
    setSource(items)
    setCount(pageSize)
  }

  const visible = items.slice(0, count)
  const remaining = Math.max(items.length - count, 0)

  return {
    visible,
    remaining,
    hasMore: remaining > 0,
    showMore: () => setCount((value) => value + pageSize),
  }
}
