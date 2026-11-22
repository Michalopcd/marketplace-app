import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { getListings } from '../../services/listingsService'
import type { Listing, ListingId } from '../../types/listing'
import {
  CATEGORY_ENTRIES,
  matchesCategoryFilter,
  type CategoryEntry,
} from '../../utils/categories'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface ListingsState {
  items: Listing[]
  status: RequestStatus
  error: string | null
}

export const initialListingsState: ListingsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const FETCH_LISTINGS_ERROR = 'Nie udało się pobrać ogłoszeń.'

/* Selectors are typed against the slice so the slice doesn't import the store (no cycles). */
interface StateWithListings {
  listings: ListingsState
}

export const fetchListings = createAsyncThunk<
  Listing[],
  void,
  { state: StateWithListings; rejectValue: string }
>(
  'listings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getListings()
    } catch {
      return rejectWithValue(FETCH_LISTINGS_ERROR)
    }
  },
  {
    // Skip duplicate requests (e.g. StrictMode double effects) so a stale response can't win.
    condition: (_, { getState }) => getState().listings.status !== 'loading',
  },
)

const listingsSlice = createSlice({
  name: 'listings',
  initialState: initialListingsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? FETCH_LISTINGS_ERROR
      })
  },
})

export const listingsReducer = listingsSlice.reducer

export const selectListings = (state: StateWithListings) => state.listings.items
export const selectListingsStatus = (state: StateWithListings) =>
  state.listings.status
export const selectListingsError = (state: StateWithListings) =>
  state.listings.error

export const selectAvailableListings = createSelector(
  [selectListings],
  (items) => items.filter((listing) => !listing.isSold),
)

/** Available listings, newest first (ISO dates sort lexicographically). */
export const selectNewestAvailableListings = createSelector(
  [selectAvailableListings],
  (items) => [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
)

export interface CategorySummary extends CategoryEntry {
  /** Available listings in the category. */
  count: number
}

/** Category entries (with their representative cover photos) plus live offer counts. */
export const selectCategorySummaries = createSelector(
  [selectAvailableListings],
  (items): CategorySummary[] =>
    CATEGORY_ENTRIES.map((entry) => ({
      ...entry,
      count: items.filter((listing) =>
        matchesCategoryFilter(listing, entry.filter),
      ).length,
    })),
)

export const selectListingById = (state: StateWithListings, id: ListingId) =>
  state.listings.items.find((listing) => listing.id === id) ?? null
