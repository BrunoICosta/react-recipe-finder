import { Link } from 'react-router'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { HeartIcon } from '@/shared/components/icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { RecipeCard } from '@/shared/components/RecipeCard'
import { RecipeGrid } from '@/shared/components/RecipeGrid'
import { EmptyState } from '@/shared/components/StateMessage'
import { FavoriteButton } from './FavoriteButton'
import { useFavorites } from './useFavorites'

export default function FavoritesPage() {
  useDocumentTitle('Favoritas')
  const { favorites } = useFavorites()

  return (
    <div className="container">
      <PageHeader
        title="Receitas favoritas"
        description={
          favorites.length > 0
            ? `${favorites.length} ${favorites.length === 1 ? 'receita salva' : 'receitas salvas'} neste navegador.`
            : 'As receitas que você salvar ficam guardadas neste navegador.'
        }
      />

      {favorites.length === 0 ? (
        <EmptyState
          icon={<HeartIcon size={28} />}
          title="Você ainda não tem favoritas"
          description="Toque no coração de uma receita para guardá-la aqui."
          action={
            <Link to="/" className="btn btn--primary">
              Explorar receitas
            </Link>
          }
        />
      ) : (
        <RecipeGrid label="Receitas favoritas">
          {favorites.map((favorite) => (
            <RecipeCard
              key={favorite.id}
              to={`/receita/${favorite.id}`}
              name={favorite.name}
              thumbnail={favorite.thumbnail}
              meta={[favorite.category, favorite.area]}
              action={<FavoriteButton recipe={favorite} variant="icon" />}
            />
          ))}
        </RecipeGrid>
      )}
    </div>
  )
}
