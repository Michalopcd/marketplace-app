// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { setupStore } from './redux/store'
import { routes } from './routes'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <Provider store={setupStore()}>
      <RouterProvider router={router} />
    </Provider>,
  )
}

describe('routes', () => {
  it('renders the index page inside the main landmark', () => {
    renderAt('/')

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'NÓW Marketplace' }),
    ).toBeInTheDocument()
  })

  it('renders NotFound for unknown paths with a link back home', () => {
    renderAt('/this/does/not/exist')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Nie znaleziono strony' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Wróć na stronę główną' }),
    ).toHaveAttribute('href', '/')
  })
})
