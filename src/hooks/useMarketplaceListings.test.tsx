// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockListings } from '../data/mockListings'
import { initialListingsState } from '../redux/slices/listingsSlice'
import { setupStore, type AppStore } from '../redux/store'
import * as listingsService from '../services/listingsService'
import { useMarketplaceListings } from './useMarketplaceListings'

const loadedStore = () =>
  setupStore({
    listings: { ...initialListingsState, status: 'succeeded', items: [...mockListings] },
  })

function renderMarketplace(store: AppStore, route = '/marketplace') {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  )
  return renderHook(() => ({ ...useMarketplaceListings(), location: useLocation() }), {
    wrapper,
  })
}

const available = mockListings.filter((listing) => !listing.isSold)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useMarketplaceListings', () => {
  it('loads listings, then returns the available ones newest first', async () => {
    const spy = vi.spyOn(listingsService, 'getListings').mockResolvedValue([...mockListings])
    const { result } = renderMarketplace(setupStore())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.listings).toEqual([])

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(spy).toHaveBeenCalledTimes(1)
    expect(result.current.listings.map((l) => l.id)).toEqual(
      available.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt)).map((l) => l.id),
    )
  })

  it('never returns sold listings', () => {
    const { result } = renderMarketplace(loadedStore())

    expect(mockListings.some((l) => l.isSold)).toBe(true)
    expect(result.current.listings.every((l) => !l.isSold)).toBe(true)
    expect(result.current.totalAvailable).toBe(available.length)
    expect(result.current.hasActiveCriteria).toBe(false)
  })

  it('applies the filters and sorting from the URL', () => {
    const { result } = renderMarketplace(
      loadedStore(),
      '/marketplace?category=fashion&subcategory=women&sortBy=price-asc',
    )

    const prices = result.current.listings.map((l) => l.price)
    expect(result.current.listings.length).toBeGreaterThan(0)
    expect(
      result.current.listings.every((l) => l.category === 'fashion' && l.subcategory === 'women'),
    ).toBe(true)
    expect(prices).toEqual(prices.toSorted((a, b) => a - b))
    expect(result.current.activeFilterCount).toBe(1)
    expect(result.current.hasActiveCriteria).toBe(true)
  })

  it('reports no results for criteria that match nothing', () => {
    const { result } = renderMarketplace(loadedStore(), '/marketplace?query=nieistniejacy-produkt')

    expect(result.current.listings).toEqual([])
    expect(result.current.totalAvailable).toBe(available.length)
    expect(result.current.activeFilterCount).toBe(0)
    expect(result.current.hasActiveCriteria).toBe(true)
  })

  it('distinguishes an empty catalogue from an empty result', () => {
    const store = setupStore({
      listings: { ...initialListingsState, status: 'succeeded', items: [] },
    })
    const { result } = renderMarketplace(store)

    expect(result.current.listings).toEqual([])
    expect(result.current.totalAvailable).toBe(0)
    expect(result.current.hasActiveCriteria).toBe(false)
  })

  it('ignores invalid URL parameters', () => {
    const { result } = renderMarketplace(loadedStore(), '/marketplace?category=cars&maxPrice=abc')

    expect(result.current.listings).toHaveLength(available.length)
    expect(result.current.hasActiveCriteria).toBe(false)
  })

  it('updates the results when the filters change', () => {
    const { result } = renderMarketplace(loadedStore())

    act(() => result.current.setFilters({ category: 'electronics' }))

    expect(result.current.location.search).toBe('?category=electronics')
    expect(result.current.listings.length).toBeGreaterThan(0)
    expect(result.current.listings.every((l) => l.category === 'electronics')).toBe(true)
  })

  it('exposes the error and refetches on retry', async () => {
    const spy = vi
      .spyOn(listingsService, 'getListings')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([...mockListings])
    const { result } = renderMarketplace(setupStore())

    await waitFor(() => expect(result.current.error).toBe('Nie udało się pobrać ogłoszeń.'))
    expect(result.current.listings).toEqual([])

    act(() => result.current.retry())

    await waitFor(() => expect(result.current.listings).toHaveLength(available.length))
    expect(result.current.error).toBeNull()
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
