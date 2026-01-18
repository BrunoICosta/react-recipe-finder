import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { AppLayout } from './layout/AppLayout'
import { RouteError } from './RouteError'

// Every page is its own chunk; the layout renders a Suspense fallback while it loads.
const SearchPage = lazy(() => import('@/features/search/SearchPage'))
const RecipePage = lazy(() => import('@/features/recipe/RecipePage'))
const CategoriesPage = lazy(() => import('@/features/browse/CategoriesPage'))
const CategoryRecipesPage = lazy(() => import('@/features/browse/CategoryRecipesPage'))
const FavoritesPage = lazy(() => import('@/features/favorites/FavoritesPage'))
const NotFoundPage = lazy(() => import('./NotFoundPage'))

export const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      errorElement: <RouteError />,
      children: [
        { index: true, element: <SearchPage /> },
        { path: 'receita/:id', element: <RecipePage /> },
        { path: 'categorias', element: <CategoriesPage /> },
        { path: 'categorias/:category', element: <CategoryRecipesPage /> },
        { path: 'favoritas', element: <FavoritesPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
