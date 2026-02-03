import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { ChefHatIcon, PlusIcon } from '@/shared/components/icons'
import { PageHeader } from '@/shared/components/PageHeader'
import { RecipeCard } from '@/shared/components/RecipeCard'
import { RecipeGrid } from '@/shared/components/RecipeGrid'
import { EmptyState } from '@/shared/components/StateMessage'
import { useTaxonomy } from '@/i18n/useTaxonomy'
import { useMyRecipes } from './useMyRecipes'

export default function MyRecipesPage() {
  const { t } = useTranslation('myRecipes')
  const taxonomy = useTaxonomy()
  useDocumentTitle(t('list.title'))
  const { recipes } = useMyRecipes()
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(taxonomy.language, { dateStyle: 'medium' }),
    [taxonomy.language],
  )

  const newRecipeLink = (
    <Link to="/minhas-receitas/nova" className="btn btn--primary">
      <PlusIcon size={18} />
      {t('list.newRecipe')}
    </Link>
  )

  return (
    <div className="container">
      <PageHeader
        title={t('list.title')}
        description={t('list.description')}
        actions={recipes.length > 0 ? newRecipeLink : undefined}
      />

      {recipes.length === 0 ? (
        <EmptyState
          icon={<ChefHatIcon size={28} />}
          title={t('list.emptyTitle')}
          description={t('list.emptyDescription')}
          action={newRecipeLink}
        />
      ) : (
        <RecipeGrid label={t('list.title')}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              to={`/minhas-receitas/${recipe.id}`}
              name={recipe.name}
              thumbnail={recipe.thumbnail || null}
              meta={[
                taxonomy.category(recipe.category),
                taxonomy.cuisine(recipe.area),
                t('list.updatedAt', { date: dateFormatter.format(new Date(recipe.updatedAt)) }),
              ]}
            />
          ))}
        </RecipeGrid>
      )}
    </div>
  )
}
