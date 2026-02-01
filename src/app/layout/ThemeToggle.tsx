import { useApplyTheme, useTheme } from '@/core/theme/useTheme'
import { MoonIcon, SunIcon } from '@/shared/components/icons'
import { useTranslation } from 'react-i18next'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { resolved, toggle } = useTheme()
  useApplyTheme(resolved)

  const isDark = resolved === 'dark'

  return (
    <button
      type="button"
      className="btn btn--ghost btn--icon"
      onClick={toggle}
      aria-label={isDark ? t('theme.toLight') : t('theme.toDark')}
      title={isDark ? t('theme.lightTitle') : t('theme.darkTitle')}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
