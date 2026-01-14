import { SEARCH_MODES, type SearchMode } from './searchModes'
import styles from './SearchModeToggle.module.css'

interface SearchModeToggleProps {
  value: SearchMode
  onChange: (mode: SearchMode) => void
}

const MODES = Object.keys(SEARCH_MODES) as SearchMode[]

export function SearchModeToggle({ value, onChange }: SearchModeToggleProps) {
  return (
    <fieldset className={styles.toggle}>
      <legend className="visually-hidden">Buscar por</legend>
      {MODES.map((mode) => (
        <label key={mode} className={styles.option}>
          <input
            type="radio"
            name="search-mode"
            value={mode}
            checked={value === mode}
            onChange={() => onChange(mode)}
          />
          <span>{SEARCH_MODES[mode].label}</span>
        </label>
      ))}
    </fieldset>
  )
}
