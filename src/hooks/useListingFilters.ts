import { useSearchParams } from 'react-router'
import type { ListingFilters } from '../types/listing'
import {
  countActiveFilters,
  DEFAULT_LISTING_FILTERS,
} from '../utils/listingFilters'
import {
  parseListingFilters,
  serializeListingFilters,
} from '../utils/listingFiltersParams'

export interface SetFiltersOptions {
  /**
   * Replace the current history entry instead of pushing a new one – for
   * frequent updates (e.g. typing a price) that shouldn't flood the Back button.
   */
  replace?: boolean
}

export interface ListingFiltersControls {
  /**
   * Filters parsed from the URL; invalid parameters are ignored. Values are
   * normalized (query trimmed and capped, invalid price range dropped), so form
   * inputs must keep their own draft state and commit it (on submit or debounced)
   * rather than bind directly to these values – see `getPriceRangeError`.
   */
  filters: ListingFilters
  /**
   * Merges `patch` into the current filters and writes them to the URL (normalized).
   * Call once per user action – put every changed field in the same patch.
   */
  setFilters: (patch: Partial<ListingFilters>, options?: SetFiltersOptions) => void
  /** Clears filters and sorting; keeps the search query. */
  resetFilters: (options?: SetFiltersOptions) => void
  activeFilterCount: number
}

/**
 * `Partial` allows `{ query: undefined }`; spreading it would overwrite a value
 * with `undefined`. An undefined field means "leave unchanged" (use `null` to clear).
 */
function withoutUndefined(patch: Partial<ListingFilters>): Partial<ListingFilters> {
  return Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined),
  )
}

/**
 * Marketplace filters stored in the URL query string – shareable links, and
 * the state survives reloads and Back/Forward. No Redux slice (Issue #10).
 */
export function useListingFilters(): ListingFiltersControls {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseListingFilters(searchParams)

  const write = (
    update: (current: ListingFilters) => ListingFilters,
    { replace = false }: SetFiltersOptions = {},
  ) => {
    // Builds on the filters of the latest render: React Router's setSearchParams
    // doesn't see a pending update, so combine changes into one patch per event.
    setSearchParams(serializeListingFilters(update(filters)), { replace })
  }

  return {
    filters,
    setFilters: (patch, options) =>
      write((current) => ({ ...current, ...withoutUndefined(patch) }), options),
    resetFilters: (options) =>
      write(({ query }) => ({ ...DEFAULT_LISTING_FILTERS, query }), options),
    activeFilterCount: countActiveFilters(filters),
  }
}
