import { useDocumentTitle } from '@/core/hooks/useDocumentTitle'
import styles from './SearchPage.module.css'

export default function SearchPage() {
  useDocumentTitle()

  return (
    <section className={`container ${styles.hero}`}>
      <p className={styles.eyebrow}>Receitas do mundo todo</p>
      <h1 className={styles.title}>O que vamos cozinhar hoje?</h1>
      <p className={styles.subtitle}>
        Busque pelo nome do prato ou pelo ingrediente que está na sua geladeira.
      </p>
    </section>
  )
}
