import { Link } from 'react-router'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { ChefHatIcon, PlusIcon } from '@/shared/components/icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { RecipeCard } from '@/shared/components/RecipeCard'
import { RecipeGrid } from '@/shared/components/RecipeGrid'
import { EmptyState } from '@/shared/components/StateMessage'
import { categoryLabel } from '@/shared/utils/labels'
import { useMyRecipes } from './useMyRecipes'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

export default function MyRecipesPage() {
  useDocumentTitle('Minhas receitas')
  const { recipes } = useMyRecipes()

  const newRecipeLink = (
    <Link to="/minhas-receitas/nova" className="btn btn--primary">
      <PlusIcon size={18} />
      Nova receita
    </Link>
  )

  return (
    <div className="container">
      <PageHeader
        title="Minhas receitas"
        description="Cadastre suas próprias receitas. Elas ficam salvas apenas neste navegador."
        actions={recipes.length > 0 ? newRecipeLink : undefined}
      />

      {recipes.length === 0 ? (
        <EmptyState
          icon={<ChefHatIcon size={28} />}
          title="Seu caderno de receitas está vazio"
          description="Que tal registrar aquela receita de família que ninguém pode esquecer?"
          action={newRecipeLink}
        />
      ) : (
        <RecipeGrid label="Minhas receitas">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              to={`/minhas-receitas/${recipe.id}`}
              name={recipe.name}
              thumbnail={recipe.thumbnail || null}
              meta={[
                recipe.category ? categoryLabel(recipe.category) : null,
                recipe.area,
                `Atualizada em ${dateFormatter.format(new Date(recipe.updatedAt))}`,
              ]}
            />
          ))}
        </RecipeGrid>
      )}
    </div>
  )
}
