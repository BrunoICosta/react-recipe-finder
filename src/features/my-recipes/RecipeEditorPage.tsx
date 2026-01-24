import { Link, useNavigate, useParams } from 'react-router'
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import { BackButton } from '@/shared/components/BackButton'
import { PageHeader } from '@/shared/components/PageHeader'
import { EmptyState } from '@/shared/components/StateMessage'
import { RecipeForm } from './components/RecipeForm'
import type { RecipeFormInput, RecipeFormValues, UserRecipe } from './schema'
import { useMyRecipes } from './useMyRecipes'
import styles from './MyRecipes.module.css'

function toFormValues(recipe: UserRecipe): RecipeFormInput {
  return {
    name: recipe.name,
    category: recipe.category,
    area: recipe.area,
    thumbnail: recipe.thumbnail,
    youtubeUrl: recipe.youtubeUrl,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
  }
}

/** Handles both /minhas-receitas/nova and /minhas-receitas/:id/editar. */
export default function RecipeEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getRecipe, createRecipe, updateRecipe } = useMyRecipes()
  const existing = id ? getRecipe(id) : null
  const isEditing = Boolean(id)

  useDocumentTitle(isEditing ? 'Editar receita' : 'Nova receita')

  if (isEditing && !existing) {
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

  const handleSubmit = (values: RecipeFormValues) => {
    if (existing) {
      updateRecipe(existing.id, values)
      navigate(`/minhas-receitas/${existing.id}`, { replace: true })
    } else {
      const created = createRecipe(values)
      navigate(`/minhas-receitas/${created.id}`, { replace: true })
    }
  }

  const backTo = existing ? `/minhas-receitas/${existing.id}` : '/minhas-receitas'

  return (
    <div className={`container ${styles.narrow}`}>
      <div className={styles.back}>
        <BackButton fallback={backTo} />
      </div>
      <PageHeader
        title={existing ? `Editar “${existing.name}”` : 'Nova receita'}
        description="Campos marcados com * são obrigatórios."
      />
      <RecipeForm
        key={existing?.id ?? 'new'}
        defaultValues={existing ? toFormValues(existing) : undefined}
        submitLabel={existing ? 'Salvar alterações' : 'Criar receita'}
        onSubmit={handleSubmit}
        onCancel={() => navigate(backTo)}
      />
    </div>
  )
}
