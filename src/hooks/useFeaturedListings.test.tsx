// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockListings } from '../data/mockListings'
import { initialListingsState } from '../redux/slices/listingsSlice'
import { setupStore, type AppStore } from '../redux/store'
import * as listingsService from '../services/listingsService'
import { FEATURED_COUNT, useFeaturedListings } from './useFeaturedListings'

function renderFeatured(store: AppStore, count?: number) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
  return renderHook(() => useFeaturedListings(count), { wrapper })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useFeaturedListings', () => {
  it('starts loading and fetches listings when nothing is loaded yet', async () => {
    const spy = vi
      .spyOn(listingsService, 'getListings')
      .mockResolvedValue([...mockListings])
    const { result } = renderFeatured(setupStore())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.listings).toEqual([])

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(spy).toHaveBeenCalledTimes(1)
    expect(result.current.listings).toHaveLength(FEATURED_COUNT)
  })

  it('returns the newest available listings, skipping sold ones', () => {
    const store = setupStore({
      listings: { ...initialListingsState, status: 'succeeded', items: [...mockListings] },
    })
    const { result } = renderFeatured(store)

    const expected = mockListings
      .filter((listing) => !listing.isSold)
      .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, FEATURED_COUNT)

    expect(result.current.listings.map((l) => l.id)).toEqual(expected.map((l) => l.id))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('does not refetch when listings are already loaded', () => {
    const spy = vi.spyOn(listingsService, 'getListings')
    const store = setupStore({
      listings: { ...initialListingsState, status: 'succeeded', items: [...mockListings] },
    })
    renderFeatured(store)

    expect(spy).not.toHaveBeenCalled()
  })

  it('respects a custom count', () => {
    const store = setupStore({
      listings: { ...initialListingsState, status: 'succeeded', items: [...mockListings] },
    })
    const { result } = renderFeatured(store, 2)

    expect(result.current.listings).toHaveLength(2)
  })

  it('exposes the error and refetches on retry', async () => {
    const spy = vi
      .spyOn(listingsService, 'getListings')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([...mockListings])
    const { result } = renderFeatured(setupStore())

    await waitFor(() => expect(result.current.error).toBe('Nie udało się pobrać ogłoszeń.'))
    expect(result.current.isLoading).toBe(false)

    act(() => result.current.retry())

    await waitFor(() => expect(result.current.listings).toHaveLength(FEATURED_COUNT))
    expect(result.current.error).toBeNull()
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
