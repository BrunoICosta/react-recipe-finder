import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { RecipeDetail } from '@/features/recipe/components/RecipeDetail'
import { BackButton } from '@/shared/components/BackButton'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { EditIcon, TrashIcon } from '@/shared/components/icons'
import { EmptyState } from '@/shared/components/StateMessage'
import { userRecipeToRecipe, useMyRecipes } from './useMyRecipes'
import styles from './MyRecipes.module.css'

export default function MyRecipeDetailPage() {
  const { t } = useTranslation(['myRecipes', 'common'])
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { getRecipe, deleteRecipe } = useMyRecipes()
  const [confirming, setConfirming] = useState(false)
  const recipe = getRecipe(id)

  useDocumentTitle(recipe?.name ?? t('notFound.title'))

  if (!recipe) {
    return (
      <div className="container">
        <EmptyState
          title={t('notFound.title')}
          description={t('notFound.description')}
          action={
            <Link to="/minhas-receitas" className="btn btn--primary">
              {t('notFound.action')}
            </Link>
          }
        />
      </div>
    )
  }

  const handleDelete = () => {
    setConfirming(false)
    // Leave the page first so it never renders the "not found" state in between.
    navigate('/minhas-receitas', { replace: true })
    deleteRecipe(recipe.id)
  }

  return (
    <div className="container">
      <div className={styles.back}>
        <BackButton fallback="/minhas-receitas" label={t('common:nav.myRecipes')} />
      </div>

      <RecipeDetail
        key={recipe.id}
        recipe={userRecipeToRecipe(recipe)}
        linkTaxonomy={false}
        actions={
          <>
            <Link to={`/minhas-receitas/${recipe.id}/editar`} className="btn btn--ghost">
              <EditIcon size={18} />
              {t('detail.edit')}
            </Link>
            <button type="button" className="btn btn--danger" onClick={() => setConfirming(true)}>
              <TrashIcon size={18} />
              {t('detail.delete')}
            </button>
          </>
        }
      />

      <ConfirmDialog
        open={confirming}
        title={t('detail.confirmTitle')}
        description={t('detail.confirmDescription', { name: recipe.name })}
        confirmLabel={t('detail.delete')}
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}
