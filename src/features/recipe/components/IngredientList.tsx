import { useState } from 'react'
import type { Ingredient } from '@/core/models/recipe'
import styles from './RecipeDetail.module.css'

function ingredientImage(name: string): string {
  return `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}-small.png`
}

function IngredientThumb({ name }: { name: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className={styles.ingredientThumb} aria-hidden="true" />
  return (
    <img
      className={styles.ingredientThumb}
      src={ingredientImage(name)}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

/** Checkable list, handy to tick ingredients off while shopping or cooking. */
export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  const [checked, setChecked] = useState<ReadonlySet<number>>(new Set())

  const toggle = (index: number) => {
    setChecked((previous) => {
      const next = new Set(previous)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <ul className={styles.ingredients}>
      {ingredients.map((ingredient, index) => (
        <li key={`${ingredient.name}-${index}`}>
          <label className={styles.ingredient} data-checked={checked.has(index)}>
            <input type="checkbox" checked={checked.has(index)} onChange={() => toggle(index)} />
            <IngredientThumb name={ingredient.name} />
            <span className={styles.ingredientText}>
              <span className={styles.ingredientName}>{ingredient.name}</span>
              {ingredient.measure && (
                <span className={styles.ingredientMeasure}>{ingredient.measure}</span>
              )}
            </span>
          </label>
        </li>
      ))}
    </ul>
  )
}
