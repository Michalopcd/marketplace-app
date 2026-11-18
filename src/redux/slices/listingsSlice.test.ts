import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockListings } from '../../data/mockListings'
import * as listingsService from '../../services/listingsService'
import { setupStore } from '../store'
import {
  FETCH_LISTINGS_ERROR,
  fetchListings,
  initialListingsState,
  listingsReducer,
  selectAvailableListings,
  selectListingById,
  selectListings,
  selectListingsError,
  selectListingsStatus,
} from './listingsSlice'

const sample = mockListings.slice(0, 3)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('listingsReducer', () => {
  it('returns the initial state', () => {
    expect(listingsReducer(undefined, { type: 'unknown' })).toEqual(
      initialListingsState,
    )
  })

  it('sets loading and clears the error on pending', () => {
    const previous = { ...initialListingsState, status: 'failed' as const, error: 'x' }
    const next = listingsReducer(previous, fetchListings.pending('req', undefined))

    expect(next.status).toBe('loading')
    expect(next.error).toBeNull()
  })

  it('stores items on fulfilled without mutating the previous state', () => {
    const previous = { ...initialListingsState, items: [sample[0]], status: 'loading' as const }
    const snapshot = structuredClone(previous)
    const next = listingsReducer(
      previous,
      fetchListings.fulfilled([...sample], 'req', undefined),
    )

    expect(next.status).toBe('succeeded')
    expect(next.items).toEqual(sample)
    expect(previous).toEqual(snapshot)
    expect(next).not.toBe(previous)
  })

  it('stores the rejection message on rejected', () => {
    const next = listingsReducer(
      initialListingsState,
      fetchListings.rejected(null, 'req', undefined, 'Custom error'),
    )

    expect(next.status).toBe('failed')
    expect(next.error).toBe('Custom error')
  })

  it('falls back to the default message when rejected without payload', () => {
    const next = listingsReducer(
      initialListingsState,
      fetchListings.rejected(new Error('boom'), 'req', undefined),
    )

    expect(next.error).toBe(FETCH_LISTINGS_ERROR)
  })
})

describe('fetchListings thunk', () => {
  it('loads listings from the service into the store', async () => {
    vi.spyOn(listingsService, 'getListings').mockResolvedValue([...sample])
    const store = setupStore()

    const pending = store.dispatch(fetchListings())
    expect(selectListingsStatus(store.getState())).toBe('loading')
    await pending

    expect(selectListingsStatus(store.getState())).toBe('succeeded')
    expect(selectListings(store.getState())).toEqual(sample)
  })

  it('skips a second request while one is in flight', async () => {
    const spy = vi
      .spyOn(listingsService, 'getListings')
      .mockResolvedValue([...sample])
    const store = setupStore()

    await Promise.all([
      store.dispatch(fetchListings()),
      store.dispatch(fetchListings()),
    ])

    expect(spy).toHaveBeenCalledTimes(1)
    expect(selectListings(store.getState())).toEqual(sample)
  })

  it('sets a user-facing error when the service fails', async () => {
    vi.spyOn(listingsService, 'getListings').mockRejectedValue(
      new Error('network down'),
    )
    const store = setupStore()

    await store.dispatch(fetchListings())

    expect(selectListingsStatus(store.getState())).toBe('failed')
    expect(selectListingsError(store.getState())).toBe(FETCH_LISTINGS_ERROR)
    expect(selectListings(store.getState())).toEqual([])
  })
})

describe('selectors', () => {
  const store = setupStore({
    listings: { ...initialListingsState, items: [...mockListings] },
  })
  const state = store.getState()

  it('selectAvailableListings excludes sold items', () => {
    const available = selectAvailableListings(state)

    expect(available.length).toBeGreaterThan(0)
    expect(available.every((listing) => !listing.isSold)).toBe(true)
    expect(available).toHaveLength(
      mockListings.filter((listing) => !listing.isSold).length,
    )
  })

  it('selectAvailableListings is memoized', () => {
    expect(selectAvailableListings(state)).toBe(selectAvailableListings(state))
  })

  it('selectListingById finds a listing or returns null', () => {
    const [first] = mockListings

    expect(selectListingById(state, first.id)).toEqual(first)
    expect(selectListingById(state, 'missing')).toBeNull()
  })
})
