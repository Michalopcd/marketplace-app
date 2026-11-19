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

/** Query keys that define *which* listings a nav link shows (unlike sorting or paging). */
const NAV_FILTER_KEYS = ['category', 'subcategory'] as const

/**
 * Whether a nav target (e.g. `/marketplace?category=home`) matches the current
 * location: same path and same category filters. Other params (sort, search
 * query) are ignored, so "Wszystkie produkty" (`/marketplace`) is active only
 * when no category filter is applied.
 */
export function isNavTargetActive(
  to: string,
  location: { pathname: string; search: string },
): boolean {
  const target = new URL(to, 'http://local')
  if (target.pathname !== location.pathname) return false

  const current = new URLSearchParams(location.search)
  return NAV_FILTER_KEYS.every(
    (key) => target.searchParams.get(key) === current.get(key),
  )
}
