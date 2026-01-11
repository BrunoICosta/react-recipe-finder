import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ChefHatIcon, CloseIcon, MenuIcon } from '@/shared/components/icons'
import { ThemeToggle } from './ThemeToggle'
import styles from './Header.module.css'

const NAV_ITEMS = [{ to: '/', label: 'Buscar', end: true }] as const

export function Header() {
  const [open, setOpen] = useState(false)
  const navId = useId()
  const { pathname } = useLocation()

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
          Receitário
        </Link>

        <div className={styles.actions}>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className={`btn btn--ghost btn--icon ${styles.menuButton}`}
          aria-expanded={open}
          aria-controls={navId}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <nav id={navId} className={styles.nav} data-open={open} aria-label="Principal">
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
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
