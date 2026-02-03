import { useTranslation } from 'react-i18next'
import { SEARCH_MODE_KEYS, type SearchMode } from './searchModes'
import styles from './SearchModeToggle.module.css'

interface SearchModeToggleProps {
  value: SearchMode
  onChange: (mode: SearchMode) => void
}

export function SearchModeToggle({ value, onChange }: SearchModeToggleProps) {
  const { t } = useTranslation('search')

  return (
    <fieldset className={styles.toggle}>
      <legend className="visually-hidden">{t('modeLegend')}</legend>
      {SEARCH_MODE_KEYS.map((mode) => (
        <label key={mode} className={styles.option}>
          <input
            type="radio"
            name="search-mode"
            value={mode}
            checked={value === mode}
            onChange={() => onChange(mode)}
          />
          <span>{t(`modes.${mode}.label`)}</span>
        </label>
      ))}
    </fieldset>
  )
}
