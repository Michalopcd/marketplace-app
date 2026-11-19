import type { Category, FashionSubcategory } from '../types/listing'

/**
 * App URLs (see the routing table in the Design Doc). Pages behind most of these
 * arrive in later sprints; until then they resolve to NotFound.
 */
export const PATHS = {
  home: '/',
  marketplace: '/marketplace',
  favorites: '/favorites',
  login: '/auth/login',
  createListing: '/listing/create',
} as const

/**
 * A category filter that respects the data model: fashion always has a
 * subcategory, other categories never do (see CLAUDE.md → Model danych).
 */
export type CategoryFilter =
  | { category: 'fashion'; subcategory: FashionSubcategory }
  | { category: Exclude<Category, 'fashion'> }

/**
 * Marketplace URL pre-filtered by category. Query keys mirror `ListingFilters`
 * so the Sprint 2 Marketplace page can read them directly.
 */
export function marketplacePath(filter: CategoryFilter): string {
  return `${PATHS.marketplace}?${new URLSearchParams(filter)}`
}
