import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { AppLayout } from './layout/AppLayout'
import { RouteError } from './RouteError'

// Every page is its own chunk; the layout renders a Suspense fallback while it loads.
const SearchPage = lazy(() => import('@/features/search/SearchPage'))
const RecipePage = lazy(() => import('@/features/recipe/RecipePage'))
const CategoriesPage = lazy(() => import('@/features/browse/CategoriesPage'))
const CategoryRecipesPage = lazy(() => import('@/features/browse/CategoryRecipesPage'))
const CuisinesPage = lazy(() => import('@/features/browse/CuisinesPage'))
const CuisineRecipesPage = lazy(() => import('@/features/browse/CuisineRecipesPage'))
const FavoritesPage = lazy(() => import('@/features/favorites/FavoritesPage'))
const MyRecipesPage = lazy(() => import('@/features/my-recipes/MyRecipesPage'))
const MyRecipeDetailPage = lazy(() => import('@/features/my-recipes/MyRecipeDetailPage'))
const RecipeEditorPage = lazy(() => import('@/features/my-recipes/RecipeEditorPage'))
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
        { path: 'cozinhas', element: <CuisinesPage /> },
        { path: 'cozinhas/:cuisine', element: <CuisineRecipesPage /> },
        { path: 'favoritas', element: <FavoritesPage /> },
        {
          path: 'minhas-receitas',
          children: [
            { index: true, element: <MyRecipesPage /> },
            { path: 'nova', element: <RecipeEditorPage /> },
            { path: ':id', element: <MyRecipeDetailPage /> },
            { path: ':id/editar', element: <RecipeEditorPage /> },
          ],
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
