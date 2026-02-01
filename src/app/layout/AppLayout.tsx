import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { PageLoader } from '@/shared/components/PageLoader'
import { Header } from './Header'
import styles from './AppLayout.module.css'
import { useTranslation } from 'react-i18next'

export function AppLayout() {
  const { t } = useTranslation()
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#conteudo">
        {t('layout.skipToContent')}
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
            {t('layout.footerData')}{' '}
            <a href="https://www.themealdb.com" target="_blank" rel="noreferrer">
              TheMealDB
            </a>
            . {t('layout.footerAuthor')}{' '}
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
