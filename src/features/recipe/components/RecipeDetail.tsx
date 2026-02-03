import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { Recipe } from '@/core/models/recipe'
import { ChefHatIcon, ExternalLinkIcon, PlayIcon } from '@/shared/components/icons'
import { thumbnailUrl } from '@/shared/utils/image'
import { useTaxonomy } from '@/i18n/useTaxonomy'
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
  const { t } = useTranslation(['recipe', 'common'])
  const taxonomy = useTaxonomy()
  const image = thumbnailUrl(recipe.thumbnail, 'large')
  const category = taxonomy.category(recipe.category)
  const cuisine = taxonomy.cuisine(recipe.area)
  const format = (value: number) => value.toLocaleString(taxonomy.language)

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
          <ul className={styles.chips} aria-label={t('classification')}>
            {recipe.category && (
              <li>
                {linkTaxonomy ? (
                  <Link to={`/categorias/${encodeURIComponent(recipe.category)}`}>{category}</Link>
                ) : (
                  <span>{category}</span>
                )}
              </li>
            )}
            {recipe.area && (
              <li>
                {linkTaxonomy ? (
                  <Link to={`/cozinhas/${encodeURIComponent(recipe.area)}`}>{cuisine}</Link>
                ) : (
                  <span>{cuisine}</span>
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
              <dt>{t('stats.ingredients')}</dt>
              <dd>{format(recipe.ingredients.length)}</dd>
            </div>
            <div>
              <dt>{t('stats.steps')}</dt>
              <dd>{format(recipe.instructions.length)}</dd>
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
                {t('watchOnYoutube')}
                <span className="visually-hidden"> {t('common:actions.opensInNewTab')}</span>
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
                {t('originalSource')}
                <span className="visually-hidden"> {t('common:actions.opensInNewTab')}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.panel} aria-labelledby="ingredients-title">
          <h2 id="ingredients-title">{t('ingredients')}</h2>
          {recipe.ingredients.length > 0 ? (
            <IngredientList ingredients={recipe.ingredients} />
          ) : (
            <p className={styles.muted}>{t('noIngredients')}</p>
          )}
        </section>

        <section className={styles.steps} aria-labelledby="steps-title">
          <h2 id="steps-title">{t('steps')}</h2>
          {recipe.instructions.length > 0 ? (
            <ol className={styles.stepList}>
              {recipe.instructions.map((step, index) => (
                <li key={index}>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.muted}>{t('noSteps')}</p>
          )}
        </section>
      </div>
    </article>
  )
}
