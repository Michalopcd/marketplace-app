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

  it('wraps pages in header, main and footer landmarks with a skip link first', () => {
    renderAt('/')

    const skipLink = screen.getByRole('link', { name: 'Przejdź do treści' })
    expect(skipLink).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()

    // The skip link must be the first focusable element on the page.
    const firstLink = document.querySelector('a, button')
    expect(firstLink).toBe(skipLink)
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
