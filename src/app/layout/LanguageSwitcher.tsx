import { useRef, type ComponentType, type KeyboardEvent, type SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, toSupportedLanguage, type Language } from '@/i18n'
import { BrazilFlag, UsaFlag } from './Flags'
import styles from './LanguageSwitcher.module.css'

/** Endonyms: each language is named in itself, as recommended for language pickers. */
const LANGUAGES: Record<Language, { name: string; Flag: ComponentType<SVGProps<SVGSVGElement>> }> =
  {
    'pt-BR': { name: 'Português (Brasil)', Flag: BrazilFlag },
    en: { name: 'English', Flag: UsaFlag },
  }

/**
 * Flag buttons following the WAI-ARIA radio group pattern: Tab reaches the
 * selected flag, arrow keys move (and switch) between languages.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const active = toSupportedLanguage(i18n.resolvedLanguage)
  const buttons = useRef<Partial<Record<Language, HTMLButtonElement | null>>>({})

  const select = (language: Language) => {
    if (language !== active) void i18n.changeLanguage(language)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0
    if (step === 0) return
    event.preventDefault()
    const index = SUPPORTED_LANGUAGES.indexOf(active)
    const next =
      SUPPORTED_LANGUAGES[(index + step + SUPPORTED_LANGUAGES.length) % SUPPORTED_LANGUAGES.length]
    select(next)
    buttons.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={t('language.label')}
      className={styles.switcher}
      onKeyDown={onKeyDown}
    >
      {SUPPORTED_LANGUAGES.map((language) => {
        const { name, Flag } = LANGUAGES[language]
        const checked = active === language
        return (
          <button
            key={language}
            ref={(element) => {
              buttons.current[language] = element
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={name}
            title={name}
            lang={language}
            tabIndex={checked ? 0 : -1}
            className={styles.option}
            onClick={() => select(language)}
          >
            <span className={styles.flag}>
              <Flag />
            </span>
          </button>
        )
      })}
    </div>
  )
}
