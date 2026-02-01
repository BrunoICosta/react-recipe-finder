import type { ReactNode } from 'react'
import styles from './Form.module.css'
import { useTranslation } from 'react-i18next'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  hint?: ReactNode
  required?: boolean
  children: ReactNode
}

export function FormField({ id, label, error, hint, required, children }: FormFieldProps) {
  const { t } = useTranslation()
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className={styles.optional}> {t('form.optional')}</span>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && <FieldError id={`${id}-error`} message={error} />}
    </div>
  )
}

export function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <p id={id} className={styles.error} role="alert">
      {message}
    </p>
  )
}
