// @vitest-environment jsdom
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockListings } from '../data/mockListings'
import {
  initialListingsState,
  type ListingsState,
} from '../redux/slices/listingsSlice'
import * as listingsService from '../services/listingsService'
import { renderWithProviders } from '../test/renderWithProviders'
import { formatOfferCount } from '../utils/formatting'
import { Marketplace } from './Marketplace'

const loaded: ListingsState = {
  ...initialListingsState,
  status: 'succeeded',
  items: [...mockListings],
}

const available = mockListings.filter((listing) => !listing.isSold)

/** Shows the current URL so tests can assert what the page writes to it. */
function LocationProbe() {
  const { pathname, search } = useLocation()
  return <output data-testid="location">{pathname + search}</output>
}

function renderMarketplace(
  route = '/marketplace',
  listings: ListingsState = loaded,
) {
  return renderWithProviders(
    <>
      <Marketplace />
      <LocationProbe />
    </>,
    { route, preloadedState: { listings } },
  )
}

const location = () => screen.getByTestId('location').textContent
const results = () => screen.getByRole('region', { name: 'Lista produktów' })
const cards = () => within(results()).queryAllByRole('article')
const searchBox = () =>
  screen.getByRole('searchbox', { name: 'Szukaj produktów' })
const resultCount = () =>
  screen
    .getAllByRole('status')
    .find((el) => el.dataset.resultCount !== undefined)

function search(text: string) {
  fireEvent.change(searchBox(), { target: { value: text } })
  fireEvent.submit(screen.getByRole('search'))
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Marketplace', () => {
  describe('structure', () => {
    it('has one h1 for all products and a labelled results region', () => {
      renderMarketplace()

      const h1s = screen.getAllByRole('heading', { level: 1 })
      expect(h1s).toHaveLength(1)
      expect(h1s[0]).toHaveTextContent('Wszystkie produkty')
      expect(
        within(results()).getByRole('heading', {
          level: 2,
          name: 'Lista produktów',
        }),
      ).toBeInTheDocument()
    })
  })

  describe('list', () => {
    it('shows every available listing and the offer count', () => {
      renderMarketplace()

      expect(cards()).toHaveLength(available.length)
      expect(resultCount()).toHaveTextContent(
        formatOfferCount(available.length),
      )
    })

    it('never shows sold listings', () => {
      renderMarketplace()

      for (const sold of mockListings.filter((listing) => listing.isSold)) {
        expect(
          within(results()).queryByText(sold.title),
        ).not.toBeInTheDocument()
      }
    })

    it('links every card to its product page', () => {
      renderMarketplace()

      const sortedAvailable = available.toSorted(
        (a, b) =>
          b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id),
      )

      const productCards = cards()

      expect(productCards).toHaveLength(sortedAvailable.length)

      sortedAvailable.forEach((listing, index) => {
        const card = productCards[index]

        expect(
          within(card).getByRole('link', { name: listing.title }),
        ).toHaveAttribute('href', `/product/${listing.id}`)
      })
    })
  })

  describe('URL filters', () => {
    it('reads a category link from the navigation', () => {
      renderMarketplace('/marketplace?category=fashion&subcategory=women')

      const women = available.filter(
        (l) => l.category === 'fashion' && l.subcategory === 'women',
      )
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Kobiety',
      )
      expect(cards()).toHaveLength(women.length)
    })

    it('reads the search query into the field and the results', () => {
      renderMarketplace('/marketplace?query=kurtka')

      const hits = available.filter((l) =>
        l.title.toLowerCase().includes('kurtka'),
      )
      expect(searchBox()).toHaveValue('kurtka')
      expect(cards()).toHaveLength(hits.length)
      expect(resultCount()).toHaveTextContent(
        `${formatOfferCount(hits.length)} dla „kurtka”`,
      )
    })
  })

  describe('search', () => {
    it('writes the query to the URL and narrows the results', () => {
      renderMarketplace()

      search('lampa')

      expect(location()).toBe('/marketplace?query=lampa')
      expect(cards().length).toBeGreaterThan(0)
      expect(cards().length).toBeLessThan(available.length)
    })

    it('keeps the category filter when searching', () => {
      renderMarketplace('/marketplace?category=electronics')

      search('aparat')

      expect(location()).toBe('/marketplace?query=aparat&category=electronics')
    })

    it('removes the query from the URL when cleared', () => {
      renderMarketplace('/marketplace?query=kurtka')

      fireEvent.click(
        screen.getByRole('button', { name: 'Wyczyść wyszukiwanie' }),
      )

      expect(location()).toBe('/marketplace')
      expect(cards()).toHaveLength(available.length)
    })
  })

  describe('no results', () => {
    it('explains the empty result and resets search and filters', () => {
      renderMarketplace('/marketplace?query=rower%20górski&category=home')

      expect(cards()).toHaveLength(0)
      expect(
        within(results()).getByRole('heading', { name: 'Brak wyników' }),
      ).toBeInTheDocument()
      expect(within(results()).getByText(/„rower górski”/)).toBeInTheDocument()
      expect(resultCount()).toHaveTextContent(
        `${formatOfferCount(0)} dla „rower górski”`,
      )

      fireEvent.click(
        screen.getByRole('button', { name: 'Wyczyść wyszukiwanie i filtry' }),
      )

      expect(location()).toBe('/marketplace')
      expect(searchBox()).toHaveValue('')
      expect(cards()).toHaveLength(available.length)
      // The button unmounts with the empty state; focus must not fall back to <body>.
      expect(searchBox()).toHaveFocus()
    })

    it('describes an empty category without a search query', () => {
      const homeOnly = {
        ...loaded,
        items: available.filter((l) => l.category === 'home'),
      }
      renderMarketplace('/marketplace?category=sports', homeOnly)

      expect(
        within(results()).getByRole('heading', { name: 'Brak wyników' }),
      ).toBeInTheDocument()
      expect(
        within(results()).getByText(
          'Nie znaleźliśmy produktów spełniających wybrane kryteria.',
        ),
      ).toBeInTheDocument()
    })
  })

  describe('request states', () => {
    it('shows skeletons and hides the count while loading', () => {
      vi.spyOn(listingsService, 'getListings').mockReturnValue(
        new Promise(() => {}),
      )
      renderMarketplace('/marketplace', initialListingsState)

      expect(screen.getByText('Ładowanie produktów…')).toBeInTheDocument()
      expect(cards()).toHaveLength(0)
      expect(resultCount()).toBeEmptyDOMElement()
    })

    it('shows the error and retries', async () => {
      const spy = vi
        .spyOn(listingsService, 'getListings')
        .mockRejectedValueOnce(new Error('offline'))
        .mockResolvedValueOnce([...mockListings])
      renderMarketplace('/marketplace', initialListingsState)

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Nie udało się pobrać ogłoszeń.',
      )
      expect(resultCount()).toBeEmptyDOMElement()

      fireEvent.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }))

      await waitFor(() => expect(cards()).toHaveLength(available.length))
      expect(spy).toHaveBeenCalledTimes(2)
    })

    it('shows an empty catalogue without a link to a missing page', () => {
      renderMarketplace('/marketplace', { ...loaded, items: [] })

      expect(
        within(results()).getByRole('heading', {
          name: 'Jeszcze nic tu nie ma',
        }),
      ).toBeInTheDocument()
      expect(within(results()).queryByRole('link')).not.toBeInTheDocument()
      expect(within(results()).queryByRole('button')).not.toBeInTheDocument()
    })
  })
})
