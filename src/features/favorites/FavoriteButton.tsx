import { useTranslation } from 'react-i18next'
import { HeartIcon } from '@/shared/components/icons'
import { useFavorites, type FavoriteInput } from './useFavorites'
import styles from './FavoriteButton.module.css'

interface FavoriteButtonProps {
  recipe: FavoriteInput
  /** "icon" floats over recipe cards; "full" shows a text label. */
  variant?: 'icon' | 'full'
}

export function FavoriteButton({ recipe, variant = 'full' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(recipe.id)
  const { t } = useTranslation('favorites')
  const label = active ? t('remove') : t('add')

  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={styles.iconButton}
        aria-pressed={active}
        aria-label={t('iconLabel', { action: label, name: recipe.name })}
        title={label}
        onClick={() => toggleFavorite(recipe)}
      >
        <HeartIcon size={20} fill={active ? 'currentColor' : 'none'} />
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`btn btn--ghost ${styles.full}`}
      aria-pressed={active}
      onClick={() => toggleFavorite(recipe)}
    >
      <HeartIcon size={18} fill={active ? 'currentColor' : 'none'} />
      {active ? t('favorited') : t('favorite')}
    </button>
  )
}
