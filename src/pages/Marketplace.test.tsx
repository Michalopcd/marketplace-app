// @vitest-environment jsdom
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { useLocation, useNavigate } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockListings } from '../data/mockListings'
import {
  initialListingsState,
  type ListingsState,
} from '../redux/slices/listingsSlice'
import * as listingsService from '../services/listingsService'
import { renderWithProviders } from '../test/renderWithProviders'
import { MARKETPLACE_PAGE_SIZE } from '../utils/constants'
import { formatOfferCount } from '../utils/formatting'
import { Marketplace } from './Marketplace'

const loaded: ListingsState = {
  ...initialListingsState,
  status: 'succeeded',
  items: [...mockListings],
}

const available = mockListings.filter((listing) => !listing.isSold)
/** Cards visible before "Załaduj więcej" (Issue #13): 20 of the 24 available listings. */
const FIRST_PAGE = Math.min(available.length, MARKETPLACE_PAGE_SIZE)

/** Shows the current URL so tests can assert what the page writes to it. */
function LocationProbe() {
  const { pathname, search } = useLocation()
  return <output data-testid="location">{pathname + search}</output>
}

/** Stands in for the browser's Back button (MemoryRouter has no browser chrome). */
function BackProbe() {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => void navigate(-1)}>
      test: wstecz
    </button>
  )
}

function renderMarketplace(
  route = '/marketplace',
  listings: ListingsState = loaded,
) {
  return renderWithProviders(
    <>
      <Marketplace />
      <LocationProbe />
      <BackProbe />
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
    it('shows the first page of available listings and the total offer count', () => {
      renderMarketplace()

      expect(cards()).toHaveLength(FIRST_PAGE)
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
      renderMarketplace('/marketplace?page=2')

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
      expect(cards()).toHaveLength(FIRST_PAGE)
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
      expect(cards()).toHaveLength(FIRST_PAGE)
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

      await waitFor(() => expect(cards()).toHaveLength(FIRST_PAGE))
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

  describe('filters (Issue #12)', () => {
    const sidebar = () => screen.getByRole('complementary', { name: 'Filtry' })
    const sidebarRadio = (name: string) => within(sidebar()).getByRole('radio', { name })
    const priceField = (name: 'Cena minimalna' | 'Cena maksymalna') =>
      within(sidebar()).getByRole('textbox', { name })
    const sortSelect = () => screen.getByRole('combobox', { name: 'Sortuj' })

    it('reflects a category link from the navigation', () => {
      renderMarketplace('/marketplace?category=fashion&subcategory=men')

      expect(sidebarRadio('Moda')).toBeChecked()
      expect(sidebarRadio('Mężczyźni')).toBeChecked()
    })

    it('filters by category and updates the URL, heading and results', () => {
      renderMarketplace()

      fireEvent.click(sidebarRadio('Elektronika'))

      const electronics = available.filter((l) => l.category === 'electronics')
      expect(location()).toBe('/marketplace?category=electronics')
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Elektronika')
      expect(cards()).toHaveLength(electronics.length)
    })

    it('combines the condition filter with the search query', () => {
      renderMarketplace('/marketplace?query=kurtka')

      fireEvent.click(sidebarRadio('Dobry'))

      expect(location()).toBe('/marketplace?query=kurtka&condition=good')
      expect(searchBox()).toHaveValue('kurtka')
    })

    it('sorts by price', () => {
      renderMarketplace()

      fireEvent.change(sortSelect(), { target: { value: 'price-asc' } })

      const prices = available.map((l) => l.price).toSorted((a, b) => a - b)
      const shown = cards().map((card) => card.textContent ?? '')
      expect(location()).toBe('/marketplace?sortBy=price-asc')
      // Sorting resets pagination: the 20 cheapest, in ascending order.
      expect(shown).toHaveLength(FIRST_PAGE)
      expect(shown[0]).toContain(formatPriceText(prices[0]))
      expect(shown.at(-1)).toContain(formatPriceText(prices[FIRST_PAGE - 1]))
    })

    it('filters by a valid price range', () => {
      renderMarketplace()

      fireEvent.change(priceField('Cena minimalna'), { target: { value: '500' } })
      fireEvent.blur(priceField('Cena minimalna'))

      expect(location()).toBe('/marketplace?minPrice=500')
      expect(cards()).toHaveLength(available.filter((l) => l.price >= 500).length)
    })

    it('rejects an inverted price range without changing the URL or the list', () => {
      renderMarketplace()

      fireEvent.change(priceField('Cena minimalna'), { target: { value: '300' } })
      fireEvent.change(priceField('Cena maksymalna'), { target: { value: '100' } })
      fireEvent.blur(priceField('Cena maksymalna'))

      expect(
        within(sidebar()).getByText('Cena minimalna nie może być wyższa od maksymalnej.'),
      ).toBeInTheDocument()
      expect(location()).toBe('/marketplace')
      expect(cards()).toHaveLength(FIRST_PAGE)
      expect(priceField('Cena minimalna')).toHaveValue('300')
    })

    it('clears filters and sorting but keeps the search query', () => {
      renderMarketplace('/marketplace?query=kurtka&category=fashion&condition=good&sortBy=price-desc')

      const clear = within(sidebar()).getByRole('button', { name: 'Wyczyść filtry (2)' })
      clear.focus()
      fireEvent.click(clear)

      expect(location()).toBe('/marketplace?query=kurtka')
      expect(searchBox()).toHaveValue('kurtka')
      expect(sidebarRadio('Wszystkie')).toBeChecked()
      // Nothing left to clear, yet keyboard focus must not fall back to <body>.
      expect(clear).toHaveFocus()
      expect(clear).toHaveAttribute('aria-disabled', 'true')
    })

    it('drops price drafts the URL never held when filters are cleared', () => {
      renderMarketplace('/marketplace?minPrice=50')

      fireEvent.change(priceField('Cena maksymalna'), { target: { value: '10' } })
      fireEvent.blur(priceField('Cena maksymalna'))
      fireEvent.click(within(sidebar()).getByRole('button', { name: 'Wyczyść filtry (1)' }))

      expect(priceField('Cena minimalna')).toHaveValue('')
      expect(priceField('Cena maksymalna')).toHaveValue('')
      expect(
        within(sidebar()).queryByText('Cena minimalna nie może być wyższa od maksymalnej.'),
      ).not.toBeInTheDocument()
    })

    describe('mobile drawer', () => {
      const trigger = () => screen.getByRole('button', { name: /^Filtry/ })

      it('shows the active filter count and filters from inside the panel', () => {
        renderMarketplace('/marketplace?category=home')

        expect(trigger()).toHaveAccessibleName('Filtry, 1 aktywny')
        fireEvent.click(trigger())
        const panel = screen.getByRole('dialog', { name: 'Filtry' })

        fireEvent.click(within(panel).getByRole('radio', { name: 'Sport' }))

        const sports = available.filter((l) => l.category === 'sports')
        expect(location()).toBe('/marketplace?category=sports')
        fireEvent.click(
          within(panel).getByRole('button', { name: `Pokaż ${formatOfferCount(sports.length)}` }),
        )
        expect(panel).not.toHaveAttribute('open')
      })
    })
  })

  describe('load more (Issue #13)', () => {
    const loadMoreButton = () => screen.queryByRole('button', { name: 'Załaduj więcej' })
    const shownStatus = () =>
      screen.getAllByRole('status').find((el) => el.textContent?.startsWith('Wyświetlono'))

    it('shows the first 20 offers with a count and a "load more" button', () => {
      renderMarketplace()

      expect(cards()).toHaveLength(FIRST_PAGE)
      expect(shownStatus()).toHaveTextContent(`Wyświetlono ${FIRST_PAGE} z ${available.length} ofert`)
      expect(loadMoreButton()).toBeInTheDocument()
    })

    it('loads the next page into the URL and moves focus to the first new card', () => {
      renderMarketplace('/marketplace?sortBy=price-asc')

      fireEvent.click(loadMoreButton()!)

      expect(location()).toBe('/marketplace?sortBy=price-asc&page=2')
      expect(cards()).toHaveLength(available.length)
      expect(shownStatus()).toHaveTextContent(
        `Wyświetlono ${available.length} z ${available.length} ofert`,
      )
      // The button disappears at the end – focus must land on the content, not on <body>.
      expect(loadMoreButton()).not.toBeInTheDocument()
      expect(within(cards()[FIRST_PAGE]).getByRole('link')).toHaveFocus()
    })

    it('restores the loaded pages from a shared link', () => {
      renderMarketplace('/marketplace?page=2')

      expect(cards()).toHaveLength(available.length)
      expect(loadMoreButton()).not.toBeInTheDocument()
    })

    it('goes back to the first page with the browser Back button', () => {
      renderMarketplace()

      fireEvent.click(loadMoreButton()!)
      fireEvent.click(screen.getByRole('button', { name: 'test: wstecz' }))

      expect(location()).toBe('/marketplace')
      expect(cards()).toHaveLength(FIRST_PAGE)
    })

    describe('starts again from the first page', () => {
      // Every case starts with all 24 cards loaded, so a reset is visible as 24 → ≤ 20.
      const startLoaded = () => {
        renderMarketplace('/marketplace?page=2')
        expect(cards()).toHaveLength(available.length)
      }

      it('when the sort order changes', () => {
        startLoaded()

        fireEvent.change(screen.getByRole('combobox', { name: 'Sortuj' }), {
          target: { value: 'price-desc' },
        })

        expect(location()).toBe('/marketplace?sortBy=price-desc')
        expect(cards()).toHaveLength(FIRST_PAGE)
      })

      it('when the search query changes', () => {
        startLoaded()

        search('a')

        const hits = available.filter((l) => l.title.toLocaleLowerCase('pl-PL').includes('a'))
        expect(location()).toBe('/marketplace?query=a')
        expect(cards()).toHaveLength(Math.min(hits.length, MARKETPLACE_PAGE_SIZE))
      })

      it('when a filter changes', () => {
        startLoaded()

        fireEvent.click(
          within(screen.getByRole('complementary', { name: 'Filtry' })).getByRole('radio', {
            name: 'Moda',
          }),
        )

        const fashion = available.filter((l) => l.category === 'fashion')
        expect(location()).toBe('/marketplace?category=fashion')
        expect(cards()).toHaveLength(Math.min(fashion.length, MARKETPLACE_PAGE_SIZE))
      })
    })

    it('has no pagination footer when the results fit on one page', () => {
      renderMarketplace('/marketplace?category=electronics')

      expect(loadMoreButton()).not.toBeInTheDocument()
      expect(shownStatus()).toBeUndefined()
    })

    it('has no pagination footer while loading', () => {
      vi.spyOn(listingsService, 'getListings').mockReturnValue(new Promise(() => {}))
      renderMarketplace('/marketplace', initialListingsState)

      expect(loadMoreButton()).not.toBeInTheDocument()
    })
  })
})

/** Matches how `ProductCard` prints a price (non-breaking space before "zł"). */
function formatPriceText(amount: number) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}
