import { useAppSelector } from '../redux/hooks'
import { selectAvailableListings } from '../redux/slices/listingsSlice'
import type { Listing } from '../types/listing'
import { applyListingFilters } from '../utils/listingFilters'
import { useListingFilters, type ListingFiltersControls } from './useListingFilters'
import { useListingsRequest, type ListingsRequest } from './useListingsRequest'

export interface MarketplaceListings extends ListingsRequest, ListingFiltersControls {
  /** Available listings matching the URL filters, in the chosen order. */
  listings: readonly Listing[]
  /** Available listings before filtering – 0 means an empty catalogue, not "no matches". */
  totalAvailable: number
  /** A search query or at least one filter is applied. */
  hasActiveCriteria: boolean
}

/**
 * Data for the MARKETPLACE page: request state, URL filters and the filtered,
 * sorted results. Sold listings are never shown (same as HOME).
 */
export function useMarketplaceListings(): MarketplaceListings {
  const request = useListingsRequest()
  const available = useAppSelector(selectAvailableListings)
  const filterControls = useListingFilters()
  const { filters, activeFilterCount } = filterControls

  return {
    ...request,
    ...filterControls,
    listings: applyListingFilters(available, filters),
    totalAvailable: available.length,
    hasActiveCriteria: filters.query !== '' || activeFilterCount > 0,
  }
}
