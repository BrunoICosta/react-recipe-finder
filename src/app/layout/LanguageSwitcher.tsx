import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, toSupportedLanguage, type Language } from '@/i18n'
import styles from './LanguageSwitcher.module.css'

/** Endonyms: each language is named in itself, as recommended for language pickers. */
const LANGUAGE_NAMES: Record<Language, { short: string; name: string }> = {
  'pt-BR': { short: 'PT', name: 'Português (Brasil)' },
  en: { short: 'EN', name: 'English' },
}

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const groupName = useId()
  const active = toSupportedLanguage(i18n.resolvedLanguage)

  return (
    <fieldset className={styles.switcher}>
      <legend className="visually-hidden">{t('language.label')}</legend>
      {SUPPORTED_LANGUAGES.map((language) => (
        <label key={language} className={styles.option} title={LANGUAGE_NAMES[language].name}>
          <input
            type="radio"
            name={groupName}
            value={language}
            checked={active === language}
            onChange={() => void i18n.changeLanguage(language)}
          />
          <span aria-hidden="true">{LANGUAGE_NAMES[language].short}</span>
          <span className="visually-hidden" lang={language}>
            {LANGUAGE_NAMES[language].name}
          </span>
        </label>
      ))}
    </fieldset>
  )
}
