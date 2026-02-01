import { useId, type FormEvent } from 'react'
import { CloseIcon, SearchIcon } from '@/shared/components/icons'
import styles from './SearchBar.module.css'
import { useTranslation } from 'react-i18next'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  /** Called on Enter, so the search runs without waiting for the debounce. */
  onSubmit: () => void
  label: string
  placeholder: string
}

export function SearchBar({ value, onChange, onSubmit, label, placeholder }: SearchBarProps) {
  const { t } = useTranslation()
  const inputId = useId()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form role="search" className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="visually-hidden">
        {label}
      </label>
      <SearchIcon className={styles.icon} />
      <input
        id={inputId}
        type="search"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className={`btn btn--sm btn--icon ${styles.clear}`}
          aria-label={t('actions.clearSearch')}
          onClick={() => onChange('')}
        >
          <CloseIcon size={18} />
        </button>
      )}
    </form>
  )
}
