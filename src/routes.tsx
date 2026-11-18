import type { RouteObject } from 'react-router'
import { RootLayout } from './components/layout/RootLayout'
import { NotFound } from './pages/NotFound'
import { RouteError } from './pages/RouteError'
import { UnderConstruction } from './pages/UnderConstruction'

/**
 * Route tree shared by the browser router and tests.
 * Remaining routes (/marketplace, /product/:id, /auth/*, …) are added with their pages.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <UnderConstruction /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
