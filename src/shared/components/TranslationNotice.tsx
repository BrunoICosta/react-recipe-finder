import { useTranslation } from 'react-i18next'
import {
  useToggleOriginal,
  useTranslationTarget,
  type TranslationStatus,
} from '@/core/translation/useAutoTranslation'
import { LanguagesIcon } from './icons'
import styles from './TranslationNotice.module.css'

interface TranslationNoticeProps {
  /** "recipe" reflects the real status; "titles" is the hint shown above card lists. */
  scope: 'recipe' | 'titles'
  status?: TranslationStatus
  limitReached?: boolean
}

/** "Tradução automática" badge with a "Ver original" toggle, or a fallback notice. */
export function TranslationNotice({ scope, status, limitReached }: TranslationNoticeProps) {
  const { t } = useTranslation()
  const target = useTranslationTarget()
  const { showOriginal, toggle } = useToggleOriginal()

  if (!target || status === 'off') return null

  if (status === 'translating') {
    return (
      <p className={styles.notice} role="status">
        <LanguagesIcon size={16} />
        {t('translation.translating')}
      </p>
    )
  }

  if (status === 'failed') {
    return (
      <p className={`${styles.notice} ${styles.muted}`} role="status">
        <LanguagesIcon size={16} />
        {limitReached ? t('translation.limit') : t('translation.failed')}
      </p>
    )
  }

  return (
    <div className={styles.notice}>
      <span className={styles.badge}>
        <LanguagesIcon size={16} />
        {scope === 'titles' ? t('translation.titlesBadge') : t('translation.badge')}
      </span>
      <button type="button" className={styles.toggle} aria-pressed={showOriginal} onClick={toggle}>
        {showOriginal ? t('translation.showTranslation') : t('translation.showOriginal')}
      </button>
    </div>
  )
}
