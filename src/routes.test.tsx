// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMemoryRouter, data, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

afterEach(() => {
  vi.restoreAllMocks()
})

/** The real root route (layout + RouteError) with one child that fails as given. */
function renderFailingRoute(fail: () => never) {
  const [{ path, element, errorElement }] = routes
  const router = createMemoryRouter(
    [{ path, element, errorElement, children: [{ path: 'broken', loader: fail }] }],
    { initialEntries: ['/broken'] },
  )
  render(
    <Provider store={setupStore()}>
      <RouterProvider router={router} />
    </Provider>,
  )
}

describe('RouteError', () => {
  it('shows the HTTP status for error responses', async () => {
    renderFailingRoute(() => {
      throw data('Missing', { status: 404 })
    })

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Coś poszło nie tak' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Błąd 404')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Wróć na stronę główną' })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('shows a generic message without a status for unexpected errors', async () => {
    // React Router logs caught errors to the console; keep the test output clean.
    vi.spyOn(console, 'error').mockImplementation(() => {})
    renderFailingRoute(() => {
      throw new Error('boom')
    })

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Coś poszło nie tak' }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/^Błąd \d+/)).not.toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})

describe('routes', () => {
  it('renders the HOME page inside the main landmark', () => {
    renderAt('/')

    expect(
      within(screen.getByRole('main')).getByRole('heading', {
        level: 1,
        name: 'Daj rzeczom drugie życie',
      }),
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

  it('renders the MARKETPLACE page and marks "Wszystkie produkty" as current', () => {
    renderAt('/marketplace')

    expect(
      within(screen.getByRole('main')).getByRole('heading', {
        level: 1,
        name: 'Wszystkie produkty',
      }),
    ).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Kategorie' })
    expect(within(nav).getByRole('link', { name: 'Wszystkie produkty' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('opens a category link from the navigation with its heading and current link', () => {
    renderAt('/marketplace?category=electronics')

    expect(
      within(screen.getByRole('main')).getByRole('heading', { level: 1, name: 'Elektronika' }),
    ).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Kategorie' })
    expect(within(nav).getByRole('link', { name: 'Elektronika' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Wszystkie produkty' })).not.toHaveAttribute(
      'aria-current',
    )
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
