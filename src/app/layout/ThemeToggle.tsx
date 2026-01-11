import { useApplyTheme, useTheme } from '@/core/theme/useTheme'
import { MoonIcon, SunIcon } from '@/shared/components/icons'

export function ThemeToggle() {
  const { resolved, toggle } = useTheme()
  useApplyTheme(resolved)

  const isDark = resolved === 'dark'

  return (
    <button
      type="button"
      className="btn btn--ghost btn--icon"
      onClick={toggle}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
