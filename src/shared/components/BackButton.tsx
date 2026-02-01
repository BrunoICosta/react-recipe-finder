import { useLocation, useNavigate } from 'react-router'
import { ArrowLeftIcon } from './icons'
import { useTranslation } from 'react-i18next'

interface BackButtonProps {
  /** Where to go when the page was opened directly (no in-app history). */
  fallback: string
  label?: string
}

export function BackButton({ fallback, label }: BackButtonProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  // React Router marks the first entry of a session with the "default" key.
  const hasHistory = location.key !== 'default'

  return (
    <button
      type="button"
      className="btn btn--ghost btn--sm"
      onClick={() => (hasHistory ? navigate(-1) : navigate(fallback))}
    >
      <ArrowLeftIcon size={18} />
      {label ?? t('actions.back')}
    </button>
  )
}
