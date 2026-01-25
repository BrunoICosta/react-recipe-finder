import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'

interface Options {
  /** Route pattern the element is mounted on, e.g. "/receita/:id". */
  path?: string
  /** Initial URL. */
  route?: string
}

/** Renders `element` inside an in-memory data router, plus a catch-all to observe redirects. */
export function renderWithRouter(
  element: ReactElement,
  { path = '/', route = path }: Options = {},
) {
  const router = createMemoryRouter(
    [
      { path, element },
      { path: '*', element: <p>Rota: outra página</p> },
    ],
    { initialEntries: [route] },
  )
  const user = userEvent.setup()
  return { user, router, ...render(<RouterProvider router={router} />) }
}
