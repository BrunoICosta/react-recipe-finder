import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import styles from './FavoritesPage.module.css'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { HeartIcon } from '@/shared/components/icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { RecipeCard } from '@/shared/components/RecipeCard'
import { RecipeGrid } from '@/shared/components/RecipeGrid'
import { EmptyState } from '@/shared/components/StateMessage'
import { useTaxonomy } from '@/i18n/useTaxonomy'
import { TranslationNotice } from '@/shared/components/TranslationNotice'
import { FavoriteButton } from './FavoriteButton'
import { useFavorites } from './useFavorites'

export default function FavoritesPage() {
  const { t } = useTranslation('favorites')
  useDocumentTitle(t('documentTitle'))
  const { favorites } = useFavorites()
  const taxonomy = useTaxonomy()

  return (
    <div className="container">
      <PageHeader
        title={t('title')}
        description={
          favorites.length > 0 ? t('savedCount', { count: favorites.length }) : t('description')
        }
      />

      {favorites.length === 0 ? (
        <EmptyState
          icon={<HeartIcon size={28} />}
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          action={
            <Link to="/" className="btn btn--primary">
              {t('explore')}
            </Link>
          }
        />
      ) : (
        <>
          <div className={styles.notice}>
            <TranslationNotice scope="titles" />
          </div>
          <RecipeGrid label={t('title')}>
            {favorites.map((favorite) => (
              <RecipeCard
                key={favorite.id}
                to={`/receita/${favorite.id}`}
                name={favorite.name}
                thumbnail={favorite.thumbnail}
                meta={[taxonomy.category(favorite.category), taxonomy.cuisine(favorite.area)]}
                translateTitle
                action={<FavoriteButton recipe={favorite} variant="icon" />}
              />
            ))}
          </RecipeGrid>
        </>
      )}
    </div>
  )
}
