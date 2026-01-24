/** Ids for aria-describedby, so screen readers announce hints and errors. */
export function describedBy(id: string, { hint, error }: { hint?: unknown; error?: unknown }) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}
