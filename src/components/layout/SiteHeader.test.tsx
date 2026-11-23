// @vitest-environment jsdom
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SiteHeader } from './SiteHeader'

function renderHeader(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SiteHeader />
    </MemoryRouter>,
  )
}

const getTrigger = () => screen.getByRole('button', { name: 'Otwórz menu' })

function openMenu() {
  fireEvent.click(getTrigger())

  return screen.getByRole('dialog', {
    name: 'Menu',
  }) as HTMLDialogElement
}

function expectSingleLink(name: string, href: string) {
  expect(
    within(screen.getByRole('banner')).getByRole('link', { name }),
  ).toHaveAttribute('href', href)
}

describe('SiteHeader', () => {
  it('sticks to the top on phones with an opaque background above page content', () => {
    renderHeader()

    // jsdom has no layout, so the contract is checked on the utilities that create it.
    // md:static keeps the desktop header (bar + category row) scrolling as before.
    expect(screen.getByRole('banner')).toHaveClass(
      'sticky',
      'top-0',
      'z-40',
      'bg-white',
      'md:static',
    )
  })

  it('renders a banner with the logo linking home', () => {
    renderHeader()

    expectSingleLink('NÓW Marketplace - strona główna', '/')
  })

  it('has no separate home/marketplace links on desktop – the logo leads home', () => {
    renderHeader()

    const banner = screen.getByRole('banner')

    expect(
      screen.queryByRole('navigation', { name: 'Główna nawigacja' }),
    ).not.toBeInTheDocument()
    expect(
      within(banner).queryByRole('link', { name: 'Strona główna' }),
    ).not.toBeInTheDocument()
    expect(
      within(banner).queryByRole('link', { name: 'Marketplace' }),
    ).not.toBeInTheDocument()
  })

  it('starts the category row with "Wszystkie produkty"', () => {
    renderHeader()

    const nav = screen.getByRole('navigation', { name: 'Kategorie' })
    const links = within(nav).getAllByRole('link')

    expect(links[0]).toHaveAccessibleName('Wszystkie produkty')
    expect(links[0]).toHaveAttribute('href', '/marketplace')
  })

  it.each([
    ['/marketplace', 'Wszystkie produkty'],
    ['/marketplace?sortBy=price-asc', 'Wszystkie produkty'],
    ['/marketplace?category=fashion&subcategory=women', 'Kobiety'],
    ['/marketplace?category=home', 'Dom'],
  ])('at %s marks only %s as the current page', (path, activeLabel) => {
    renderHeader(path)

    const nav = screen.getByRole('navigation', { name: 'Kategorie' })
    const current = within(nav)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page')

    expect(current).toHaveLength(1)
    expect(current[0]).toHaveAccessibleName(activeLabel)
  })

  it('marks no category as current outside the marketplace', () => {
    renderHeader('/favorites')

    const nav = screen.getByRole('navigation', { name: 'Kategorie' })

    for (const link of within(nav).getAllByRole('link')) {
      expect(link).not.toHaveAttribute('aria-current')
    }
  })

  it('links categories to a pre-filtered marketplace, splitting fashion by audience', () => {
    renderHeader()

    const nav = screen.getByRole('navigation', {
      name: 'Kategorie',
    })

    expect(within(nav).getByRole('link', { name: 'Kobiety' })).toHaveAttribute(
      'href',
      '/marketplace?category=fashion&subcategory=women',
    )

    expect(
      within(nav).getByRole('link', { name: 'Elektronika' }),
    ).toHaveAttribute('href', '/marketplace?category=electronics')

    expect(
      within(nav).queryByRole('link', { name: 'Moda' }),
    ).not.toBeInTheDocument()
  })

  it('exposes header actions with accessible names', () => {
    renderHeader()

    expectSingleLink('Ulubione', '/favorites')
    expectSingleLink('Zaloguj się', '/auth/login')
    expectSingleLink('Sprzedaj', '/listing/create')
  })

  describe('mobile menu', () => {
    it('is closed initially and linked to its trigger', () => {
      renderHeader()

      const trigger = getTrigger()

      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      const dialog = document.getElementById(
        trigger.getAttribute('aria-controls') ?? '',
      )

      expect(dialog?.tagName).toBe('DIALOG')
    })

    it('opens as a dialog and updates aria-expanded', () => {
      renderHeader()

      const dialog = openMenu()

      expect(dialog).toHaveAttribute('open')
      expect(getTrigger()).toHaveAttribute('aria-expanded', 'true')

      expect(
        within(dialog).getByRole('link', { name: 'Sprzedaj' }),
      ).toHaveAttribute('href', '/listing/create')

      expect(
        within(dialog).getByRole('link', { name: 'Ulubione' }),
      ).toHaveAttribute('href', '/favorites')
    })

    it('keeps "Strona główna" and replaces "Marketplace" with "Wszystkie produkty"', () => {
      renderHeader('/marketplace')

      const dialog = openMenu()

      expect(
        within(dialog).getByRole('link', { name: 'Strona główna' }),
      ).toHaveAttribute('href', '/')
      expect(
        within(dialog).getByRole('link', { name: 'Wszystkie produkty' }),
      ).toHaveAttribute('aria-current', 'page')
      expect(
        within(dialog).queryByRole('link', { name: 'Marketplace' }),
      ).not.toBeInTheDocument()
    })

    it('closes with the close button', () => {
      renderHeader()

      const dialog = openMenu()

      fireEvent.click(
        within(dialog).getByRole('button', {
          name: 'Zamknij menu',
        }),
      )

      expect(dialog).not.toHaveAttribute('open')
      expect(getTrigger()).toHaveAttribute('aria-expanded', 'false')
    })

    it.each([
      'Wszystkie produkty',
      'NÓW Marketplace - strona główna',
      'Sprzedaj',
    ])('closes after choosing the "%s" link', (name) => {
      renderHeader()

      const dialog = openMenu()

      fireEvent.click(within(dialog).getByRole('link', { name }))

      expect(dialog).not.toHaveAttribute('open')
      expect(getTrigger()).toHaveAttribute('aria-expanded', 'false')
    })

    it('syncs state when the dialog closes', () => {
      renderHeader()

      const dialog = openMenu()

      act(() => {
        dialog.close()
      })

      expect(dialog).not.toHaveAttribute('open')
      expect(getTrigger()).toHaveAttribute('aria-expanded', 'false')
    })

    it('closes on a backdrop click but not on a click inside the panel', () => {
      renderHeader()

      const dialog = openMenu()

      fireEvent.click(
        within(dialog).getByRole('navigation', {
          name: 'Menu mobilne',
        }),
      )

      expect(dialog).toHaveAttribute('open')

      fireEvent.click(dialog)

      expect(dialog).not.toHaveAttribute('open')
    })

    describe('when the viewport changes', () => {
      /** Tailwind's `md` breakpoint, where the full header navigation appears. */
      const DESKTOP_QUERY = '(min-width: 48rem)'

      /** A MediaQueryList whose `change` event the test fires by hand. */
      function controllableMediaQuery() {
        const list = Object.assign(new EventTarget(), {
          matches: false,
          media: DESKTOP_QUERY,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
        }) as MediaQueryList
        const emit = (matches: boolean) =>
          act(() => {
            Object.assign(list, { matches })
            list.dispatchEvent(Object.assign(new Event('change'), { matches }))
          })
        vi.spyOn(window, 'matchMedia').mockReturnValue(list)
        return emit
      }

      afterEach(() => {
        vi.restoreAllMocks()
      })

      it('closes the menu when the viewport widens to the desktop layout', () => {
        const emit = controllableMediaQuery()
        renderHeader()
        const dialog = openMenu()

        expect(window.matchMedia).toHaveBeenCalledWith(DESKTOP_QUERY)

        emit(true)

        // A hidden modal would leave the page inert – it must close itself.
        expect(dialog).not.toHaveAttribute('open')
        expect(getTrigger()).toHaveAttribute('aria-expanded', 'false')
      })

      it('stays open while the viewport remains mobile', () => {
        const emit = controllableMediaQuery()
        renderHeader()
        const dialog = openMenu()

        emit(false)

        expect(dialog).toHaveAttribute('open')
        expect(getTrigger()).toHaveAttribute('aria-expanded', 'true')
      })
    })
  })
})
