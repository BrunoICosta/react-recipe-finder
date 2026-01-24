import { useState } from 'react'
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
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { getRecipe, deleteRecipe } = useMyRecipes()
  const [confirming, setConfirming] = useState(false)
  const recipe = getRecipe(id)

  useDocumentTitle(recipe?.name ?? 'Receita não encontrada')

  if (!recipe) {
    return (
      <div className="container">
        <EmptyState
          title="Receita não encontrada"
          description="Ela pode ter sido excluída ou criada em outro navegador."
          action={
            <Link to="/minhas-receitas" className="btn btn--primary">
              Ver minhas receitas
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
        <BackButton fallback="/minhas-receitas" label="Minhas receitas" />
      </div>

      <RecipeDetail
        key={recipe.id}
        recipe={userRecipeToRecipe(recipe)}
        linkTaxonomy={false}
        actions={
          <>
            <Link to={`/minhas-receitas/${recipe.id}/editar`} className="btn btn--ghost">
              <EditIcon size={18} />
              Editar
            </Link>
            <button type="button" className="btn btn--danger" onClick={() => setConfirming(true)}>
              <TrashIcon size={18} />
              Excluir
            </button>
          </>
        }
      />

      <ConfirmDialog
        open={confirming}
        title="Excluir receita?"
        description={`“${recipe.name}” será removida deste navegador. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}
