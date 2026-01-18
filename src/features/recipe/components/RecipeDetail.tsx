import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { Recipe } from '@/core/models/recipe'
import { ChefHatIcon, ExternalLinkIcon, PlayIcon } from '@/shared/components/icons'
import { thumbnailUrl } from '@/shared/utils/image'
import { categoryLabel } from '@/shared/utils/labels'
import { IngredientList } from './IngredientList'
import styles from './RecipeDetail.module.css'

interface RecipeDetailProps {
  recipe: Recipe
  /** Buttons rendered next to the title (favorite, edit, delete…). */
  actions?: ReactNode
  /** Own recipes are not part of TheMealDB, so category/cuisine are not links. */
  linkTaxonomy?: boolean
}

export function RecipeDetail({ recipe, actions, linkTaxonomy = true }: RecipeDetailProps) {
  const image = thumbnailUrl(recipe.thumbnail, 'large')

  return (
    <article className={styles.detail}>
      <header className={styles.hero}>
        <div className={styles.media}>
          {image ? (
            <img src={image} alt={recipe.name} width={700} height={700} />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              <ChefHatIcon size={64} />
            </div>
          )}
        </div>

        <div className={styles.summary}>
          <ul className={styles.chips} aria-label="Classificação">
            {recipe.category && (
              <li>
                {linkTaxonomy ? (
                  <Link to={`/categorias/${encodeURIComponent(recipe.category)}`}>
                    {categoryLabel(recipe.category)}
                  </Link>
                ) : (
                  <span>{categoryLabel(recipe.category)}</span>
                )}
              </li>
            )}
            {recipe.area && (
              <li>
                {linkTaxonomy ? (
                  <Link to={`/cozinhas/${encodeURIComponent(recipe.area)}`}>{recipe.area}</Link>
                ) : (
                  <span>{recipe.area}</span>
                )}
              </li>
            )}
            {recipe.tags.map((tag) => (
              <li key={tag}>
                <span className={styles.tag}>#{tag}</span>
              </li>
            ))}
          </ul>

          <h1 className={styles.title}>{recipe.name}</h1>

          <dl className={styles.stats}>
            <div>
              <dt>Ingredientes</dt>
              <dd>{recipe.ingredients.length}</dd>
            </div>
            <div>
              <dt>Etapas</dt>
              <dd>{recipe.instructions.length}</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            {actions}
            {recipe.youtubeUrl && (
              <a
                className="btn btn--primary"
                href={recipe.youtubeUrl}
                target="_blank"
                rel="noreferrer"
              >
                <PlayIcon size={18} />
                Assistir no YouTube
                <span className="visually-hidden"> (abre em nova aba)</span>
              </a>
            )}
            {recipe.sourceUrl && (
              <a
                className="btn btn--ghost"
                href={recipe.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLinkIcon size={18} />
                Receita original
                <span className="visually-hidden"> (abre em nova aba)</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.panel} aria-labelledby="ingredients-title">
          <h2 id="ingredients-title">Ingredientes</h2>
          {recipe.ingredients.length > 0 ? (
            <IngredientList ingredients={recipe.ingredients} />
          ) : (
            <p className={styles.muted}>Nenhum ingrediente informado.</p>
          )}
        </section>

        <section className={styles.steps} aria-labelledby="steps-title">
          <h2 id="steps-title">Modo de preparo</h2>
          {recipe.instructions.length > 0 ? (
            <ol className={styles.stepList}>
              {recipe.instructions.map((step, index) => (
                <li key={index}>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.muted}>Nenhuma instrução informada.</p>
          )}
        </section>
      </div>
    </article>
  )
}
