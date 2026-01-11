import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { useLocalStorage } from '@/core/hooks/useLocalStorage'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

/** Also read by the inline script in index.html to avoid a flash of the wrong theme. */
export const THEME_STORAGE_KEY = 'receitario:theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function parseTheme(value: unknown): ThemePreference {
  if (value === 'light' || value === 'dark' || value === 'system') return value
  throw new Error(`Invalid theme: ${String(value)}`)
}

function getMediaQuery(): MediaQueryList | null {
  return typeof window.matchMedia === 'function' ? window.matchMedia(DARK_QUERY) : null
}

function subscribeToSystemTheme(listener: () => void): () => void {
  const query = getMediaQuery()
  query?.addEventListener('change', listener)
  return () => query?.removeEventListener('change', listener)
}

function usePrefersDark(): boolean {
  return useSyncExternalStore(
    subscribeToSystemTheme,
    () => getMediaQuery()?.matches ?? false,
    () => false,
  )
}

export function useTheme() {
  const [preference, setPreference] = useLocalStorage<ThemePreference>(
    THEME_STORAGE_KEY,
    'system',
    { parse: parseTheme },
  )
  const prefersDark = usePrefersDark()
  const resolved: ResolvedTheme =
    preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference

  const toggle = useCallback(() => {
    setPreference(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setPreference])

  return { preference, resolved, setPreference, toggle }
}

/** Mirrors the resolved theme on <html data-theme>, which the CSS tokens key off. */
export function useApplyTheme(theme: ResolvedTheme): void {
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
}
