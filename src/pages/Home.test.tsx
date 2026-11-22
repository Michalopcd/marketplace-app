// @vitest-environment jsdom
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockListings } from '../data/mockListings'
import { FEATURED_COUNT } from '../hooks/useFeaturedListings'
import { initialListingsState, type ListingsState } from '../redux/slices/listingsSlice'
import * as listingsService from '../services/listingsService'
import { renderWithProviders } from '../test/renderWithProviders'
import { formatOfferCount } from '../utils/formatting'
import { Home } from './Home'

const loaded: ListingsState = {
  ...initialListingsState,
  status: 'succeeded',
  items: [...mockListings],
}

const newestAvailable = mockListings
  .filter((listing) => !listing.isSold)
  .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))

const featuredRegion = () =>
  screen.getByRole('region', { name: 'Świeżo dodane' })

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Home', () => {
  describe('structure', () => {
    it('has exactly one h1 and h2 headings for every section', () => {
      renderWithProviders(<Home />, { preloadedState: { listings: loaded } })

      const h1s = screen.getAllByRole('heading', { level: 1 })
      expect(h1s).toHaveLength(1)
      expect(h1s[0]).toHaveAccessibleName('Daj rzeczom drugie życie')

      expect(
        screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent),
      ).toEqual([
        'Przeglądaj kategorie',
        'Świeżo dodane',
        'Moda może krążyć. I dobrze jej to robi.',
      ])
    })

    it('labels each section region by its heading', () => {
      renderWithProviders(<Home />, { preloadedState: { listings: loaded } })

      for (const name of [
        'Daj rzeczom drugie życie',
        'Przeglądaj kategorie',
        'Świeżo dodane',
        'Moda może krążyć. I dobrze jej to robi.',
      ]) {
        expect(screen.getByRole('region', { name })).toBeInTheDocument()
      }
    })
  })

  describe('hero', () => {
    it('links the CTAs to the marketplace and to listing creation', () => {
      renderWithProviders(<Home />, { preloadedState: { listings: loaded } })
      const hero = screen.getByRole('region', { name: 'Daj rzeczom drugie życie' })

      expect(within(hero).getByRole('link', { name: 'Odkrywaj perełki' })).toHaveAttribute(
        'href',
        '/marketplace',
      )
      expect(
        within(hero).getByRole('link', { name: 'Zacznij sprzedawać' }),
      ).toHaveAttribute('href', '/listing/create')
    })

    it('describes the hero photo', () => {
      renderWithProviders(<Home />, { preloadedState: { listings: loaded } })

      expect(
        screen.getByRole('img', {
          name: 'Starannie wybrane ubrania wiszące w jasnym studio',
        }),
      ).toBeInTheDocument()
    })
  })

  describe('categories', () => {
    it('lists every category with a pre-filtered link and its offer count', () => {
      renderWithProviders(<Home />, { preloadedState: { listings: loaded } })
      const section = screen.getByRole('region', { name: 'Przeglądaj kategorie' })

      const items = within(section).getAllByRole('listitem')
      expect(items).toHaveLength(7)

      const women = within(section).getByRole('link', { name: /Kobiety/ })
      expect(women).toHaveAttribute(
        'href',
        '/marketplace?category=fashion&subcategory=women',
      )
      const womenCount = newestAvailable.filter(
        (l) => l.category === 'fashion' && l.subcategory === 'women',
      ).length
      expect(women).toHaveTextContent(formatOfferCount(womenCount))

      expect(
        within(section).getByRole('link', { name: 'Zobacz wszystkie' }),
      ).toHaveAttribute('href', '/marketplace')
    })

    it('hides offer counts while loading', () => {
      vi.spyOn(listingsService, 'getListings').mockReturnValue(new Promise(() => {}))
      renderWithProviders(<Home />)
      const section = screen.getByRole('region', { name: 'Przeglądaj kategorie' })

      expect(within(section).queryByText(/ofert/)).not.toBeInTheDocument()
      // Category links work regardless of the data state.
      expect(within(section).getAllByRole('link', { name: /Dom|Sport/ })).toHaveLength(2)
    })
  })

  describe('featured listings states', () => {
    it('shows a loading status with skeletons before data arrives', () => {
      vi.spyOn(listingsService, 'getListings').mockReturnValue(new Promise(() => {}))
      renderWithProviders(<Home />)

      expect(within(featuredRegion()).getByRole('status')).toHaveTextContent(
        'Ładowanie produktów…',
      )
      expect(within(featuredRegion()).queryByRole('list')).not.toBeInTheDocument()
    })

    it('shows the newest available products, linking to their details', () => {
      renderWithProviders(<Home />, { preloadedState: { listings: loaded } })

      const cards = within(featuredRegion()).getAllByRole('article')
      expect(cards).toHaveLength(FEATURED_COUNT)

      const expected = newestAvailable.slice(0, FEATURED_COUNT)
      expected.forEach((listing, index) => {
        expect(
          within(cards[index]).getByRole('link', { name: listing.title }),
        ).toHaveAttribute('href', `/product/${listing.id}`)
      })
      expect(within(featuredRegion()).queryByText('Sprzedane')).not.toBeInTheDocument()
    })

    it('shows an error with a retry that refetches and recovers', async () => {
      const spy = vi
        .spyOn(listingsService, 'getListings')
        .mockRejectedValueOnce(new Error('offline'))
        .mockResolvedValueOnce([...mockListings])
      renderWithProviders(<Home />)

      const alert = await within(featuredRegion()).findByRole('alert')
      expect(alert).toHaveTextContent('Nie udało się pobrać ogłoszeń.')

      fireEvent.click(within(alert).getByRole('button', { name: 'Spróbuj ponownie' }))

      await waitFor(() =>
        expect(within(featuredRegion()).getAllByRole('article')).toHaveLength(
          FEATURED_COUNT,
        ),
      )
      expect(spy).toHaveBeenCalledTimes(2)
    })

    it('shows an empty state with a call to action when there are no listings', () => {
      renderWithProviders(<Home />, {
        preloadedState: { listings: { ...loaded, items: [] } },
      })

      expect(
        within(featuredRegion()).getByRole('heading', { name: 'Jeszcze nic tu nie ma' }),
      ).toBeInTheDocument()
      expect(
        within(featuredRegion()).getByRole('link', { name: 'Dodaj pierwsze ogłoszenie' }),
      ).toHaveAttribute('href', '/listing/create')
    })

    it('treats only-sold listings as empty', () => {
      renderWithProviders(<Home />, {
        preloadedState: {
          listings: {
            ...loaded,
            items: mockListings.map((listing) => ({ ...listing, isSold: true })),
          },
        },
      })

      expect(
        within(featuredRegion()).getByRole('heading', { name: 'Jeszcze nic tu nie ma' }),
      ).toBeInTheDocument()
    })
  })
})
