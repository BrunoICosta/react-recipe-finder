import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { PageLoader } from '@/shared/components/PageLoader'
import { Header } from './Header'
import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className={styles.main} tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <p>
            Dados de receitas por{' '}
            <a href="https://www.themealdb.com" target="_blank" rel="noreferrer">
              TheMealDB
            </a>
            . Feito por{' '}
            <a href="https://github.com/BrunoICosta" target="_blank" rel="noreferrer">
              Bruno Costa
            </a>
            .
          </p>
        </div>
      </footer>
      <ScrollRestoration />
    </div>
  )
}
