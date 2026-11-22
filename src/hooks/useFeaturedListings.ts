import { useAppSelector } from '../redux/hooks'
import { selectNewestAvailableListings } from '../redux/slices/listingsSlice'
import type { Listing } from '../types/listing'
import { useListingsRequest, type ListingsRequest } from './useListingsRequest'

/** Four fill one row on desktop and two full rows on phones/tablets (2 → 4 columns). */
export const FEATURED_COUNT = 4

export interface FeaturedListings extends ListingsRequest {
  listings: readonly Listing[]
}

/** Newest available listings for the HOME "Świeżo dodane" section. */
export function useFeaturedListings(count = FEATURED_COUNT): FeaturedListings {
  const request = useListingsRequest()
  const newest = useAppSelector(selectNewestAvailableListings)

  return { ...request, listings: newest.slice(0, count) }
}
