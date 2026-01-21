import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getRandomRecipe } from '@/core/api/mealdb'
import { ShuffleIcon } from '@/shared/components/icons'
import styles from './RandomRecipeButton.module.css'

type Status = 'idle' | 'loading' | 'error'

interface RandomRecipeButtonProps {
  /** "compact" hides the text label on small screens (used in the header). */
  variant?: 'compact' | 'full'
}

export function RandomRecipeButton({ variant = 'full' }: RandomRecipeButtonProps) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('idle')

  const pickRandom = async () => {
    setStatus('loading')
    try {
      const recipe = await getRandomRecipe()
      if (!recipe) throw new Error('Empty random response')
      setStatus('idle')
      navigate(`/receita/${recipe.id}`)
    } catch {
      setStatus('error')
    }
  }

  const loading = status === 'loading'

  return (
    <>
      <button
        type="button"
        className={`btn btn--primary ${variant === 'compact' ? styles.compact : ''}`}
        onClick={pickRandom}
        disabled={loading}
        aria-busy={loading}
        title="Sortear uma receita"
      >
        <ShuffleIcon size={18} className={loading ? styles.spinning : undefined} />
        <span className={styles.label}>
          {loading ? 'Sorteando…' : status === 'error' ? 'Tentar de novo' : 'Surpreenda-me'}
        </span>
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">
        {status === 'error' ? 'Não foi possível sortear uma receita. Tente novamente.' : ''}
      </span>
    </>
  )
}
