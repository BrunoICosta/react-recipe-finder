import { useEffect, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router'
import { ChefHatIcon, CloseIcon, MenuIcon } from '@/shared/components/icons'
import { useFavorites } from '@/features/favorites/useFavorites'
import { RandomRecipeButton } from '@/features/random/RandomRecipeButton'
import { ThemeToggle } from './ThemeToggle'
import styles from './Header.module.css'

type NavKey = 'search' | 'categories' | 'cuisines' | 'favorites' | 'myRecipes'

interface NavItem {
  to: string
  key: NavKey
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', key: 'search', end: true },
  { to: '/categorias', key: 'categories' },
  { to: '/cozinhas', key: 'cuisines' },
  { to: '/favoritas', key: 'favorites' },
  { to: '/minhas-receitas', key: 'myRecipes' },
]

export function Header() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const navId = useId()
  const { pathname } = useLocation()
  const { favorites } = useFavorites()

  // Close the mobile menu after navigating. Adjusting state while rendering
  // (instead of in an effect) avoids an extra paint with the menu still open.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>
            <ChefHatIcon size={22} />
          </span>
          {t('app.name')}
        </Link>

        <div className={styles.actions}>
          <RandomRecipeButton variant="compact" />
          <ThemeToggle />
        </div>

        <button
          type="button"
          className={`btn btn--ghost btn--icon ${styles.menuButton}`}
          aria-expanded={open}
          aria-controls={navId}
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <nav id={navId} className={styles.nav} data-open={open} aria-label={t('nav.label')}>
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  {t(`nav.${item.key}`)}
                  {item.key === 'favorites' && favorites.length > 0 && (
                    <span className={styles.badge}>
                      <span aria-hidden="true">{favorites.length}</span>
                      <span className="visually-hidden">
                        {' '}
                        ({t('nav.favoritesBadge', { count: favorites.length })})
                      </span>
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
