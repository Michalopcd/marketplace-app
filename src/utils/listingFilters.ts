import type { Listing, ListingFilters, SortOption } from '../types/listing'
import { LOCALE } from './constants'

/**
 * Pure search, filter and sort logic for the product list (client-side, Sprint 2).
 * Works on any listing array, so the Firestore data of Sprint 5 can reuse it unchanged.
 */
export const DEFAULT_LISTING_FILTERS: Readonly<ListingFilters> = Object.freeze({
  query: '',
  category: null,
  subcategory: null,
  condition: null,
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
})

const normalizeText = (text: string) => text.trim().toLocaleLowerCase(LOCALE)

function matchesFilters(
  listing: Listing,
  { category, subcategory, condition, minPrice, maxPrice }: ListingFilters,
  query: string,
): boolean {
  if (query && !normalizeText(listing.title).includes(query)) return false
  if (category && listing.category !== category) return false
  // Subcategories exist only in fashion (CLAUDE.md → Model danych); "fashion" alone means all of it.
  if (category === 'fashion' && subcategory && listing.subcategory !== subcategory) {
    return false
  }
  if (condition && listing.condition !== condition) return false
  if (minPrice !== null && listing.price < minPrice) return false
  if (maxPrice !== null && listing.price > maxPrice) return false
  return true
}

/** Listings matching every constraint (AND). Search looks at the title only. */
export function filterListings(
  listings: readonly Listing[],
  filters: ListingFilters,
): Listing[] {
  const query = normalizeText(filters.query)
  return listings.filter((listing) => matchesFilters(listing, filters, query))
}

/** Newest first; ties broken by id so the order is deterministic. ISO dates sort lexicographically. */
const byNewest = (a: Listing, b: Listing) =>
  b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id)

const COMPARATORS: Record<SortOption, (a: Listing, b: Listing) => number> = {
  newest: byNewest,
  'price-asc': (a, b) => a.price - b.price || byNewest(a, b),
  'price-desc': (a, b) => b.price - a.price || byNewest(a, b),
}

/** A sorted copy – the input array is never mutated. */
export function sortListings(
  listings: readonly Listing[],
  sortBy: SortOption,
): Listing[] {
  return listings.toSorted(COMPARATORS[sortBy])
}

export function applyListingFilters(
  listings: readonly Listing[],
  filters: ListingFilters,
): Listing[] {
  return sortListings(filterListings(listings, filters), filters.sortBy)
}

export type PriceRangeError = 'min-greater-than-max'

/**
 * Validates a price range without changing it. The URL parser drops an invalid
 * range; the filters form (#12) uses this to show an error while keeping the
 * values the user typed.
 */
export function getPriceRangeError(
  minPrice: number | null,
  maxPrice: number | null,
): PriceRangeError | null {
  return minPrice !== null && maxPrice !== null && minPrice > maxPrice
    ? 'min-greater-than-max'
    : null
}

/**
 * Number of active filters for the "Filtry (N)" badge: category (with its
 * subcategory), condition and price range count once each; search and sorting don't.
 */
export function countActiveFilters({
  category,
  condition,
  minPrice,
  maxPrice,
}: ListingFilters): number {
  return [
    category !== null,
    condition !== null,
    minPrice !== null || maxPrice !== null,
  ].filter(Boolean).length
}
